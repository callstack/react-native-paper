import * as React from 'react'
import { useState, useEffect } from 'react'
import {
  PanResponder,
  Animated,
  StyleSheet,
  StyleProp,
  GestureResponderEvent,
  PanResponderGestureState,
  ViewStyle,
  Platform,
  I18nManager
} from 'react-native'
import { Block } from './block'
import { findKey, findIndex, differenceBy } from './utils'

export interface IOnLayoutEvent {
  nativeEvent: { layout: { x: number; y: number; width: number; height: number } }
}

interface IBaseItemType {
  key: string | number
  disabledDrag?: boolean
  disabledReSorted?: boolean
}

export interface IDraggableGridProps<DataType extends IBaseItemType> {
  numColumns: number
  data: DataType[]
  renderItem: (item: DataType, order: number) => React.ReactElement<any>
  style?: ViewStyle
  itemHeight?: number
  dragStartAnimation?: StyleProp<any>
  onItemPress?: (item: DataType) => void
  onDragItemActive?: (item: DataType) => void
  onDragStart?: (item: DataType) => void
  onDragging?: (gestureState: PanResponderGestureState) => void
  onDragRelease?: (newSortedData: DataType[]) => void
  onResetSort?: (newSortedData: DataType[]) => void
  delayLongPress?: number
}
interface IMap<T> {
  [key: string]: T
}
interface IPositionOffset {
  x: number
  y: number
}
interface IOrderMapItem {
  order: number
}
interface IItem<DataType> {
  key: string | number
  itemData: DataType
  currentPosition: Animated.AnimatedValueXY
}
let activeBlockOffset = { x: 0, y: 0 }

export const DraggableGrid = function<DataType extends IBaseItemType>(
  props: IDraggableGridProps<DataType>,
) {
  const [blockPositions] = useState<IPositionOffset[]>([])
  const [orderMap] = useState<IMap<IOrderMapItem>>({})
  const [itemMap] = useState<IMap<DataType>>({})
  const [items] = useState<IItem<DataType>[]>([])
  const [blockHeight, setBlockHeight] = useState(0)
  const [blockWidth, setBlockWidth] = useState(0)
  const [gridHeight] = useState<Animated.Value>(new Animated.Value(0))
  const [hadInitBlockSize, setHadInitBlockSize] = useState(false)
  const [dragStartAnimatedValue] = useState(new Animated.Value(1))
  const [gridLayout, setGridLayout] = useState({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  })
  const [activeItemIndex, setActiveItemIndex] = useState<undefined | number>()

  const assessGridSize = (event: IOnLayoutEvent) => {
    if (!hadInitBlockSize) {
      let blockWidth = event.nativeEvent.layout.width / props.numColumns
      let blockHeight = props.itemHeight || blockWidth
      setBlockWidth(blockWidth)
      setBlockHeight(blockHeight)
      setGridLayout(event.nativeEvent.layout)
      setHadInitBlockSize(true)
    }
  }
  const [panResponderCapture, setPanResponderCapture] = useState(false)

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onStartShouldSetPanResponderCapture: () => false,
    onMoveShouldSetPanResponder: () => panResponderCapture,
    onMoveShouldSetPanResponderCapture: () => panResponderCapture,
    onShouldBlockNativeResponder: () => false,
    onPanResponderTerminationRequest: () => false,
    onPanResponderGrant: onStartDrag,
    onPanResponderMove: onHandMove,
    onPanResponderRelease: onHandRelease,
  })

  function initBlockPositions() {
    items.forEach((_, index) => {
      blockPositions[index] = getBlockPositionByOrder(index)
    })
  }
  function getBlockPositionByOrder(order: number) {
    if (blockPositions[order]) {
      return blockPositions[order]
    }
    const columnOnRow = order % props.numColumns
    const y = blockHeight * Math.floor(order / props.numColumns)
    const x = columnOnRow * blockWidth
    return {
      x,
      y,
    }
  }
  function resetGridHeight() {
    const rowCount = Math.ceil(props.data.length / props.numColumns)
    gridHeight.setValue(rowCount * blockHeight)
  }
  function onBlockPress(itemIndex: number) {
    props.onItemPress && props.onItemPress(items[itemIndex].itemData)
  }
  function onStartDrag(_: GestureResponderEvent, gestureState: PanResponderGestureState) {
    const activeItem = getActiveItem()
    if (!activeItem) return false
    props.onDragStart && props.onDragStart(activeItem.itemData)
    const { x0, y0, moveX, moveY } = gestureState
    const activeOrigin = blockPositions[orderMap[activeItem.key].order]
    const x = activeOrigin.x + (I18nManager.isRTL ? x0 : -x0)
    const y = activeOrigin.y - y0
    activeItem.currentPosition.setOffset({
      x,
      y,
    })
    activeBlockOffset = {
      x,
      y,
    }
    activeItem.currentPosition.setValue({
      x: I18nManager.isRTL ? -moveX : moveX,
      y: moveY,
    })
  }
  function onHandMove(_: GestureResponderEvent, gestureState: PanResponderGestureState) {
    const activeItem = getActiveItem()
    if (!activeItem) return false
    const { moveX:moveXOriginal, moveY } = gestureState
    const moveX = I18nManager.isRTL ? -moveXOriginal : moveXOriginal
    props.onDragging && props.onDragging(gestureState)

    const xChokeAmount = Math.max(0, activeBlockOffset.x + moveX - (gridLayout.width - blockWidth))
    const xMinChokeAmount = Math.min(0, activeBlockOffset.x + moveX)

    const dragPosition = {
      x: moveX - xChokeAmount - xMinChokeAmount,
      y: moveY,
    }
    const originPosition = blockPositions[orderMap[activeItem.key].order]
    const dragPositionToActivePositionDistance = getDistance(dragPosition, originPosition)
    activeItem.currentPosition.setValue(dragPosition)

    let closetItemIndex = activeItemIndex as number
    let closetDistance = dragPositionToActivePositionDistance

    items.forEach((item, index) => {
      if (item.itemData.disabledReSorted) return
      if (index != activeItemIndex) {
        const dragPositionToItemPositionDistance = getDistance(
          dragPosition,
          blockPositions[orderMap[item.key].order],
        )
        if (
          dragPositionToItemPositionDistance < closetDistance &&
          dragPositionToItemPositionDistance < blockWidth
        ) {
          closetItemIndex = index
          closetDistance = dragPositionToItemPositionDistance
        }
      }
    })
    if (activeItemIndex != closetItemIndex) {
      const closetOrder = orderMap[items[closetItemIndex].key].order
      resetBlockPositionByOrder(orderMap[activeItem.key].order, closetOrder)
      orderMap[activeItem.key].order = closetOrder
      props.onResetSort && props.onResetSort(getSortData())
    }
  }
  function onHandRelease() {
    const activeItem = getActiveItem()
    if (!activeItem) return false
    props.onDragRelease && props.onDragRelease(getSortData())
    setPanResponderCapture(false)
    activeItem.currentPosition.flattenOffset()
    moveBlockToBlockOrderPosition(activeItem.key)
    setActiveItemIndex(undefined)
  }
  function resetBlockPositionByOrder(activeItemOrder: number, insertedPositionOrder: number) {
    let disabledReSortedItemCount = 0
    if (activeItemOrder > insertedPositionOrder) {
      for (let i = activeItemOrder - 1; i >= insertedPositionOrder; i--) {
        const key = getKeyByOrder(i)
        const item = itemMap[key]
        if (item && item.disabledReSorted) {
          disabledReSortedItemCount++
        } else {
          orderMap[key].order += disabledReSortedItemCount + 1
          disabledReSortedItemCount = 0
          moveBlockToBlockOrderPosition(key)
        }
      }
    } else {
      for (let i = activeItemOrder + 1; i <= insertedPositionOrder; i++) {
        const key = getKeyByOrder(i)
        const item = itemMap[key]
        if (item && item.disabledReSorted) {
          disabledReSortedItemCount++
        } else {
          orderMap[key].order -= disabledReSortedItemCount + 1
          disabledReSortedItemCount = 0
          moveBlockToBlockOrderPosition(key)
        }
      }
    }
  }
  function moveBlockToBlockOrderPosition(itemKey: string | number) {
    const itemIndex = findIndex(items, item => `${item.key}` === `${itemKey}`)
    items[itemIndex].currentPosition.flattenOffset()
    Animated.timing(items[itemIndex].currentPosition, {
      toValue: blockPositions[orderMap[itemKey].order],
      duration: 200,
      useNativeDriver: false,
    }).start()
  }
  function getKeyByOrder(order: number) {
    return findKey(orderMap, (item: IOrderMapItem) => item.order === order) as string
  }

  function getSortData() {
    const sortData: DataType[] = []
    items.forEach(item => {
      sortData[orderMap[item.key].order] = item.itemData
    })
    return sortData
  }
  function getDistance(startOffset: IPositionOffset, endOffset: IPositionOffset) {
    const xDistance = startOffset.x + activeBlockOffset.x - endOffset.x
    const yDistance = startOffset.y + activeBlockOffset.y - endOffset.y
    return Math.sqrt(Math.pow(xDistance, 2) + Math.pow(yDistance, 2))
  }
  function setActiveBlock(itemIndex: number, item: DataType) {
    if (item.disabledDrag) return

    props.onDragItemActive && props.onDragItemActive(item)

    setPanResponderCapture(true)
    setActiveItemIndex(itemIndex)
  }
  function startDragStartAnimation() {
    if (!props.dragStartAnimation) {
      dragStartAnimatedValue.setValue(1)
      Animated.timing(dragStartAnimatedValue, {
        toValue: 1.1,
        duration: 100,
        useNativeDriver: false,
      }).start()
    }
  }
  function getBlockStyle(itemIndex: number) {
    return [
      {
        justifyContent: 'center',
        alignItems: 'center',
      },
      hadInitBlockSize && {
        width: blockWidth,
        height: blockHeight,
        position: 'absolute',
        top: items[itemIndex].currentPosition.getLayout().top,
        left: I18nManager.isRTL && Platform.OS === 'web' ? undefined: items[itemIndex].currentPosition.getLayout().left,
        right: I18nManager.isRTL && Platform.OS === 'web' ? items[itemIndex].currentPosition.getLayout().left : undefined,
},
    ]
  }
  function getDragStartAnimation(itemIndex: number) {
    if (activeItemIndex != itemIndex) {
      return
    }

    const dragStartAnimation = props.dragStartAnimation || getDefaultDragStartAnimation()
    return {
      zIndex: 3,
      ...dragStartAnimation,
    }
  }
  function getActiveItem() {
    if (activeItemIndex === undefined) return false
    return items[activeItemIndex]
  }
  function getDefaultDragStartAnimation() {
    return {
      transform: [
        {
          scale: dragStartAnimatedValue,
        },
      ],
      shadowColor: '#000000',
      shadowOpacity: 0.2,
      shadowRadius: 6,
      shadowOffset: {
        width: 1,
        height: 1,
      },
    }
  }
  function addItem(item: DataType, index: number) {
    blockPositions.push(getBlockPositionByOrder(items.length))
    orderMap[item.key] = {
      order: index,
    }
    itemMap[item.key] = item
    items.push({
      key: item.key,
      itemData: item,
      currentPosition: new Animated.ValueXY(getBlockPositionByOrder(index)),
    })
  }

  function removeItem(item: IItem<DataType>) {
    const itemIndex = findIndex(items, curItem => curItem.key === item.key)
    items.splice(itemIndex, 1)
    blockPositions.pop()
    delete orderMap[item.key]
  }
  function diffData() {
    props.data.forEach((item, index) => {
      if (orderMap[item.key]) {
        if (orderMap[item.key].order != index) {
          orderMap[item.key].order = index
          moveBlockToBlockOrderPosition(item.key)
        }
        const currentItem = items.find(i => i.key === item.key)
        if (currentItem) {
          currentItem.itemData = item
        }
        itemMap[item.key] = item
      } else {
        addItem(item, index)
      }
    })
    const deleteItems = differenceBy(items, props.data, 'key')
    deleteItems.forEach(item => {
      removeItem(item)
    })
  }
  useEffect(() => {
    startDragStartAnimation()
  }, [activeItemIndex])
  useEffect(() => {
    if (hadInitBlockSize) {
      initBlockPositions()
    }
  }, [gridLayout])
  useEffect(() => {
    resetGridHeight()
  })
  if (hadInitBlockSize) {
    diffData()
  }
  const itemList = items.map((item, itemIndex) => {
    return (
      <Block
        onPress={onBlockPress.bind(null, itemIndex)}
        onLongPress={setActiveBlock.bind(null, itemIndex, item.itemData)}
        panHandlers={panResponder.panHandlers}
        style={getBlockStyle(itemIndex)}
        dragStartAnimationStyle={getDragStartAnimation(itemIndex)}
        delayLongPress={props.delayLongPress || 300}
        key={item.key}>
        {props.renderItem(item.itemData, orderMap[item.key].order)}
      </Block>
    )
  })

  return (
    <Animated.View
      style={[
        styles.draggableGrid,
        props.style,
        {
          height: gridHeight,
        },
      ]}
      onLayout={assessGridSize}>
      {hadInitBlockSize && itemList}
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  draggableGrid: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
})
