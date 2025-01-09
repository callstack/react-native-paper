"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[8096],{57107:(e,n,o)=>{o.r(n),o.d(n,{assets:()=>d,contentTitle:()=>i,default:()=>y,frontMatter:()=>t,metadata:()=>s,toc:()=>c});var l=o(58168),r=(o(96540),o(15680)),p=o(27450),a=(o(51597),o(86315),o(72584));const t={title:"FAB.Group"},i=void 0,s={unversionedId:"components/FAB/FABGroup",id:"components/FAB/FABGroup",title:"FAB.Group",description:"A component to display a stack of FABs with related actions in a speed dial.",source:"@site/docs/components/FAB/FABGroup.mdx",sourceDirName:"components/FAB",slug:"/components/FAB/FABGroup",permalink:"/react-native-paper/docs/components/FAB/FABGroup",draft:!1,editUrl:"https://github.com/callstack/react-native-paper/tree/main/src/components/FAB/FABGroup.tsx",tags:[],version:"current",frontMatter:{title:"FAB.Group"},sidebar:"components",previous:{title:"AnimatedFAB",permalink:"/react-native-paper/docs/components/FAB/AnimatedFAB"},next:{title:"HelperText",permalink:"/react-native-paper/docs/components/HelperText/"}},d={},c=[{value:"Usage",id:"usage",level:2},{value:"Props",id:"props",level:2},{value:"actions (required)",id:"actions-required",level:3},{value:"icon (required)",id:"icon-required",level:3},{value:"accessibilityLabel",id:"accessibilitylabel",level:3},{value:"color",id:"color",level:3},{value:"backdropColor",id:"backdropcolor",level:3},{value:"rippleColor",id:"ripplecolor",level:3},{value:"onPress",id:"onpress",level:3},{value:"onLongPress",id:"onlongpress",level:3},{value:"toggleStackOnLongPress",id:"togglestackonlongpress",level:3},{value:"delayLongPress",id:"delaylongpress",level:3},{value:"enableLongPressWhenStackOpened",id:"enablelongpresswhenstackopened",level:3},{value:"open (required)",id:"open-required",level:3},{value:"onStateChange (required)",id:"onstatechange-required",level:3},{value:"visible (required)",id:"visible-required",level:3},{value:"style",id:"style",level:3},{value:"fabStyle",id:"fabstyle",level:3},{value:'variant  <span class="badge badge-supported "><span class="badge-text">Available in v5.x with theme version 3</span></span>',id:"variant--available-in-v5x-with-theme-version-3",level:3},{value:"theme",id:"theme",level:3},{value:"label",id:"label",level:3},{value:"testID",id:"testid",level:3}],g={toc:c},u="wrapper";function y(e){let{components:n,...o}=e;return(0,r.yg)(u,(0,l.A)({},g,o,{components:n,mdxType:"MDXLayout"}),(0,r.yg)("p",null,"A component to display a stack of FABs with related actions in a speed dial.\nTo render the group above other components, you'll need to wrap it with the ",(0,r.yg)("a",{parentName:"p",href:"../Portal"},(0,r.yg)("inlineCode",{parentName:"a"},"Portal"))," component."),(0,r.yg)(a.A,{screenshotData:"screenshots/fab-group.gif",baseUrl:"/react-native-paper/",mdxType:"ScreenshotTabs"}),(0,r.yg)("h2",{id:"usage"},"Usage"),(0,r.yg)("pre",null,(0,r.yg)("code",{parentName:"pre",className:"language-js"},"import * as React from 'react';\nimport { FAB, Portal, PaperProvider } from 'react-native-paper';\n\nconst MyComponent = () => {\n  const [state, setState] = React.useState({ open: false });\n\n  const onStateChange = ({ open }) => setState({ open });\n\n  const { open } = state;\n\n  return (\n    <PaperProvider>\n      <Portal>\n        <FAB.Group\n          open={open}\n          visible\n          icon={open ? 'calendar-today' : 'plus'}\n          actions={[\n            { icon: 'plus', onPress: () => console.log('Pressed add') },\n            {\n              icon: 'star',\n              label: 'Star',\n              onPress: () => console.log('Pressed star'),\n            },\n            {\n              icon: 'email',\n              label: 'Email',\n              onPress: () => console.log('Pressed email'),\n            },\n            {\n              icon: 'bell',\n              label: 'Remind',\n              onPress: () => console.log('Pressed notifications'),\n            },\n          ]}\n          onStateChange={onStateChange}\n          onPress={() => {\n            if (open) {\n              // do something if the speed dial is open\n            }\n          }}\n        />\n      </Portal>\n    </PaperProvider>\n  );\n};\n\nexport default MyComponent;\n")),(0,r.yg)("h2",{id:"props"},"Props"),(0,r.yg)("span",null),(0,r.yg)("div",null,(0,r.yg)("h3",{id:"actions-required"},"actions (required)")),(0,r.yg)(p.A,{componentLink:"FAB/FABGroup",prop:"actions",mdxType:"PropTable"}),(0,r.yg)("div",null,(0,r.yg)("h3",{id:"icon-required"},"icon (required)")),(0,r.yg)(p.A,{componentLink:"FAB/FABGroup",prop:"icon",mdxType:"PropTable"}),(0,r.yg)("div",null,(0,r.yg)("h3",{id:"accessibilitylabel"},"accessibilityLabel")),(0,r.yg)(p.A,{componentLink:"FAB/FABGroup",prop:"accessibilityLabel",mdxType:"PropTable"}),(0,r.yg)("div",null,(0,r.yg)("h3",{id:"color"},"color")),(0,r.yg)(p.A,{componentLink:"FAB/FABGroup",prop:"color",mdxType:"PropTable"}),(0,r.yg)("div",null,(0,r.yg)("h3",{id:"backdropcolor"},"backdropColor")),(0,r.yg)(p.A,{componentLink:"FAB/FABGroup",prop:"backdropColor",mdxType:"PropTable"}),(0,r.yg)("div",null,(0,r.yg)("h3",{id:"ripplecolor"},"rippleColor")),(0,r.yg)(p.A,{componentLink:"FAB/FABGroup",prop:"rippleColor",mdxType:"PropTable"}),(0,r.yg)("div",null,(0,r.yg)("h3",{id:"onpress"},"onPress")),(0,r.yg)(p.A,{componentLink:"FAB/FABGroup",prop:"onPress",mdxType:"PropTable"}),(0,r.yg)("div",null,(0,r.yg)("h3",{id:"onlongpress"},"onLongPress")),(0,r.yg)(p.A,{componentLink:"FAB/FABGroup",prop:"onLongPress",mdxType:"PropTable"}),(0,r.yg)("div",null,(0,r.yg)("h3",{id:"togglestackonlongpress"},"toggleStackOnLongPress")),(0,r.yg)(p.A,{componentLink:"FAB/FABGroup",prop:"toggleStackOnLongPress",mdxType:"PropTable"}),(0,r.yg)("div",null,(0,r.yg)("h3",{id:"delaylongpress"},"delayLongPress")),(0,r.yg)(p.A,{componentLink:"FAB/FABGroup",prop:"delayLongPress",mdxType:"PropTable"}),(0,r.yg)("div",null,(0,r.yg)("h3",{id:"enablelongpresswhenstackopened"},"enableLongPressWhenStackOpened")),(0,r.yg)(p.A,{componentLink:"FAB/FABGroup",prop:"enableLongPressWhenStackOpened",mdxType:"PropTable"}),(0,r.yg)("div",null,(0,r.yg)("h3",{id:"open-required"},"open (required)")),(0,r.yg)(p.A,{componentLink:"FAB/FABGroup",prop:"open",mdxType:"PropTable"}),(0,r.yg)("div",null,(0,r.yg)("h3",{id:"onstatechange-required"},"onStateChange (required)")),(0,r.yg)(p.A,{componentLink:"FAB/FABGroup",prop:"onStateChange",mdxType:"PropTable"}),(0,r.yg)("div",null,(0,r.yg)("h3",{id:"visible-required"},"visible (required)")),(0,r.yg)(p.A,{componentLink:"FAB/FABGroup",prop:"visible",mdxType:"PropTable"}),(0,r.yg)("div",null,(0,r.yg)("h3",{id:"style"},"style")),(0,r.yg)(p.A,{componentLink:"FAB/FABGroup",prop:"style",mdxType:"PropTable"}),(0,r.yg)("div",null,(0,r.yg)("h3",{id:"fabstyle"},"fabStyle")),(0,r.yg)(p.A,{componentLink:"FAB/FABGroup",prop:"fabStyle",mdxType:"PropTable"}),(0,r.yg)("div",null,(0,r.yg)("h3",{id:"variant--available-in-v5x-with-theme-version-3"},"variant  ",(0,r.yg)("span",{class:"badge badge-supported "},(0,r.yg)("span",{class:"badge-text"},"Available in v5.x with theme version 3")))),(0,r.yg)(p.A,{componentLink:"FAB/FABGroup",prop:"variant",mdxType:"PropTable"}),(0,r.yg)("div",null,(0,r.yg)("h3",{id:"theme"},"theme")),(0,r.yg)(p.A,{componentLink:"FAB/FABGroup",prop:"theme",mdxType:"PropTable"}),(0,r.yg)("div",null,(0,r.yg)("h3",{id:"label"},"label")),(0,r.yg)(p.A,{componentLink:"FAB/FABGroup",prop:"label",mdxType:"PropTable"}),(0,r.yg)("div",null,(0,r.yg)("h3",{id:"testid"},"testID")),(0,r.yg)(p.A,{componentLink:"FAB/FABGroup",prop:"testID",mdxType:"PropTable"}),(0,r.yg)("span",null),(0,r.yg)("span",null),(0,r.yg)("span",null))}y.isMDXComponent=!0}}]);