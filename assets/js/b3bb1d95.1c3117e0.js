"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[2755],{98021:(e,n,o)=>{o.r(n),o.d(n,{assets:()=>c,contentTitle:()=>s,default:()=>g,frontMatter:()=>d,metadata:()=>p,toc:()=>m});var l=o(58168),i=(o(96540),o(15680)),t=o(27450),a=(o(51597),o(86315)),r=o(72584);const d={title:"AnimatedFAB"},s=void 0,p={unversionedId:"components/FAB/AnimatedFAB",id:"components/FAB/AnimatedFAB",title:"AnimatedFAB",description:"An animated, extending horizontally floating action button represents the primary action in an application.",source:"@site/docs/components/FAB/AnimatedFAB.mdx",sourceDirName:"components/FAB",slug:"/components/FAB/AnimatedFAB",permalink:"/react-native-paper/docs/components/FAB/AnimatedFAB",draft:!1,editUrl:"https://github.com/callstack/react-native-paper/tree/main/src/components/FAB/AnimatedFAB.tsx",tags:[],version:"current",frontMatter:{title:"AnimatedFAB"},sidebar:"components",previous:{title:"FAB",permalink:"/react-native-paper/docs/components/FAB/"},next:{title:"FAB.Group",permalink:"/react-native-paper/docs/components/FAB/FABGroup"}},c={},m=[{value:"Usage",id:"usage",level:2},{value:"Props",id:"props",level:2},{value:"icon (required)",id:"icon-required",level:3},{value:"label (required)",id:"label-required",level:3},{value:"uppercase",id:"uppercase",level:3},{value:"background",id:"background",level:3},{value:"accessibilityLabel",id:"accessibilitylabel",level:3},{value:"accessibilityState",id:"accessibilitystate",level:3},{value:"color",id:"color",level:3},{value:"rippleColor",id:"ripplecolor",level:3},{value:"disabled",id:"disabled",level:3},{value:"visible",id:"visible",level:3},{value:"onPress",id:"onpress",level:3},{value:"onLongPress",id:"onlongpress",level:3},{value:"delayLongPress",id:"delaylongpress",level:3},{value:"iconMode",id:"iconmode",level:3},{value:"animateFrom",id:"animatefrom",level:3},{value:"extended",id:"extended",level:3},{value:"labelMaxFontSizeMultiplier",id:"labelmaxfontsizemultiplier",level:3},{value:'variant  <span class="badge badge-supported "><span class="badge-text">Available in v5.x with theme version 3</span></span>',id:"variant--available-in-v5x-with-theme-version-3",level:3},{value:"style",id:"style",level:3},{value:"theme",id:"theme",level:3},{value:"testID",id:"testid",level:3},{value:"Theme colors",id:"theme-colors",level:2}],y={toc:m},A="wrapper";function g(e){let{components:n,...o}=e;return(0,i.yg)(A,(0,l.A)({},y,o,{components:n,mdxType:"MDXLayout"}),(0,i.yg)("p",null,"An animated, extending horizontally floating action button represents the primary action in an application."),(0,i.yg)(r.A,{screenshotData:"screenshots/animated-fab.gif",baseUrl:"/react-native-paper/",mdxType:"ScreenshotTabs"}),(0,i.yg)("h2",{id:"usage"},"Usage"),(0,i.yg)("pre",null,(0,i.yg)("code",{parentName:"pre",className:"language-js"},"import React from 'react';\nimport {\n  StyleProp,\n  ViewStyle,\n  Animated,\n  StyleSheet,\n  Platform,\n  ScrollView,\n  Text,\n  SafeAreaView,\n  I18nManager,\n} from 'react-native';\nimport { AnimatedFAB } from 'react-native-paper';\n\nconst MyComponent = ({\n  animatedValue,\n  visible,\n  extended,\n  label,\n  animateFrom,\n  style,\n  iconMode,\n}) => {\n  const [isExtended, setIsExtended] = React.useState(true);\n\n  const isIOS = Platform.OS === 'ios';\n\n  const onScroll = ({ nativeEvent }) => {\n    const currentScrollPosition =\n      Math.floor(nativeEvent?.contentOffset?.y) ?? 0;\n\n    setIsExtended(currentScrollPosition <= 0);\n  };\n\n  const fabStyle = { [animateFrom]: 16 };\n\n  return (\n    <SafeAreaView style={styles.container}>\n      <ScrollView onScroll={onScroll}>\n        {[...new Array(100).keys()].map((_, i) => (\n          <Text>{i}</Text>\n        ))}\n      </ScrollView>\n      <AnimatedFAB\n        icon={'plus'}\n        label={'Label'}\n        extended={isExtended}\n        onPress={() => console.log('Pressed')}\n        visible={visible}\n        animateFrom={'right'}\n        iconMode={'static'}\n        style={[styles.fabStyle, style, fabStyle]}\n      />\n    </SafeAreaView>\n  );\n};\n\nexport default MyComponent;\n\nconst styles = StyleSheet.create({\n  container: {\n    flexGrow: 1,\n  },\n  fabStyle: {\n    bottom: 16,\n    right: 16,\n    position: 'absolute',\n  },\n});\n")),(0,i.yg)("h2",{id:"props"},"Props"),(0,i.yg)("span",null),(0,i.yg)("div",null,(0,i.yg)("h3",{id:"icon-required"},"icon (required)")),(0,i.yg)(t.A,{componentLink:"FAB/AnimatedFAB",prop:"icon",mdxType:"PropTable"}),(0,i.yg)("div",null,(0,i.yg)("h3",{id:"label-required"},"label (required)")),(0,i.yg)(t.A,{componentLink:"FAB/AnimatedFAB",prop:"label",mdxType:"PropTable"}),(0,i.yg)("div",null,(0,i.yg)("h3",{id:"uppercase"},"uppercase")),(0,i.yg)(t.A,{componentLink:"FAB/AnimatedFAB",prop:"uppercase",mdxType:"PropTable"}),(0,i.yg)("div",null,(0,i.yg)("h3",{id:"background"},"background")),(0,i.yg)(t.A,{componentLink:"FAB/AnimatedFAB",prop:"background",mdxType:"PropTable"}),(0,i.yg)("div",null,(0,i.yg)("h3",{id:"accessibilitylabel"},"accessibilityLabel")),(0,i.yg)(t.A,{componentLink:"FAB/AnimatedFAB",prop:"accessibilityLabel",mdxType:"PropTable"}),(0,i.yg)("div",null,(0,i.yg)("h3",{id:"accessibilitystate"},"accessibilityState")),(0,i.yg)(t.A,{componentLink:"FAB/AnimatedFAB",prop:"accessibilityState",mdxType:"PropTable"}),(0,i.yg)("div",null,(0,i.yg)("h3",{id:"color"},"color")),(0,i.yg)(t.A,{componentLink:"FAB/AnimatedFAB",prop:"color",mdxType:"PropTable"}),(0,i.yg)("div",null,(0,i.yg)("h3",{id:"ripplecolor"},"rippleColor")),(0,i.yg)(t.A,{componentLink:"FAB/AnimatedFAB",prop:"rippleColor",mdxType:"PropTable"}),(0,i.yg)("div",null,(0,i.yg)("h3",{id:"disabled"},"disabled")),(0,i.yg)(t.A,{componentLink:"FAB/AnimatedFAB",prop:"disabled",mdxType:"PropTable"}),(0,i.yg)("div",null,(0,i.yg)("h3",{id:"visible"},"visible")),(0,i.yg)(t.A,{componentLink:"FAB/AnimatedFAB",prop:"visible",mdxType:"PropTable"}),(0,i.yg)("div",null,(0,i.yg)("h3",{id:"onpress"},"onPress")),(0,i.yg)(t.A,{componentLink:"FAB/AnimatedFAB",prop:"onPress",mdxType:"PropTable"}),(0,i.yg)("div",null,(0,i.yg)("h3",{id:"onlongpress"},"onLongPress")),(0,i.yg)(t.A,{componentLink:"FAB/AnimatedFAB",prop:"onLongPress",mdxType:"PropTable"}),(0,i.yg)("div",null,(0,i.yg)("h3",{id:"delaylongpress"},"delayLongPress")),(0,i.yg)(t.A,{componentLink:"FAB/AnimatedFAB",prop:"delayLongPress",mdxType:"PropTable"}),(0,i.yg)("div",null,(0,i.yg)("h3",{id:"iconmode"},"iconMode")),(0,i.yg)(t.A,{componentLink:"FAB/AnimatedFAB",prop:"iconMode",mdxType:"PropTable"}),(0,i.yg)("div",null,(0,i.yg)("h3",{id:"animatefrom"},"animateFrom")),(0,i.yg)(t.A,{componentLink:"FAB/AnimatedFAB",prop:"animateFrom",mdxType:"PropTable"}),(0,i.yg)("div",null,(0,i.yg)("h3",{id:"extended"},"extended")),(0,i.yg)(t.A,{componentLink:"FAB/AnimatedFAB",prop:"extended",mdxType:"PropTable"}),(0,i.yg)("div",null,(0,i.yg)("h3",{id:"labelmaxfontsizemultiplier"},"labelMaxFontSizeMultiplier")),(0,i.yg)(t.A,{componentLink:"FAB/AnimatedFAB",prop:"labelMaxFontSizeMultiplier",mdxType:"PropTable"}),(0,i.yg)("div",null,(0,i.yg)("h3",{id:"variant--available-in-v5x-with-theme-version-3"},"variant  ",(0,i.yg)("span",{class:"badge badge-supported "},(0,i.yg)("span",{class:"badge-text"},"Available in v5.x with theme version 3")))),(0,i.yg)(t.A,{componentLink:"FAB/AnimatedFAB",prop:"variant",mdxType:"PropTable"}),(0,i.yg)("div",null,(0,i.yg)("h3",{id:"style"},"style")),(0,i.yg)(t.A,{componentLink:"FAB/AnimatedFAB",prop:"style",mdxType:"PropTable"}),(0,i.yg)("div",null,(0,i.yg)("h3",{id:"theme"},"theme")),(0,i.yg)(t.A,{componentLink:"FAB/AnimatedFAB",prop:"theme",mdxType:"PropTable"}),(0,i.yg)("div",null,(0,i.yg)("h3",{id:"testid"},"testID")),(0,i.yg)(t.A,{componentLink:"FAB/AnimatedFAB",prop:"testID",mdxType:"PropTable"}),(0,i.yg)("span",null),(0,i.yg)("h2",{id:"theme-colors"},"Theme colors"),(0,i.yg)(a.A,{themeColorsData:{disabled:{backgroundColor:"theme.colors.surfaceDisabled","textColor/iconColor":"theme.colors.onSurfaceDisabled"},primary:{backgroundColor:"theme.colors.primaryContainer","textColor/iconColor":"theme.colors.onPrimaryContainer"},secondary:{backgroundColor:"theme.colors.secondaryContainer","textColor/iconColor":"theme.colors.onSecondaryContainer"},tertiary:{backgroundColor:"theme.colors.tertiaryContainer","textColor/iconColor":"theme.colors.onTertiaryContainer"},surface:{backgroundColor:"theme.colors.elevarion.level3","textColor/iconColor":"theme.colors.primary"}},componentName:"AnimatedFAB",mdxType:"ThemeColorsTable"}),(0,i.yg)("span",null))}g.isMDXComponent=!0}}]);