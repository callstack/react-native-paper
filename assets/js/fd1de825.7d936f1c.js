"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[6090],{54787:(o,e,t)=>{t.r(e),t.d(e,{assets:()=>l,contentTitle:()=>d,default:()=>m,frontMatter:()=>i,metadata:()=>p,toc:()=>s});var n=t(58168),a=(t(96540),t(15680)),r=t(27450),u=(t(51597),t(86315),t(72584));const i={title:"RadioButton.Group"},d=void 0,p={unversionedId:"components/RadioButton/RadioButtonGroup",id:"components/RadioButton/RadioButtonGroup",title:"RadioButton.Group",description:"Radio button group allows to control a group of radio buttons.",source:"@site/docs/components/RadioButton/RadioButtonGroup.mdx",sourceDirName:"components/RadioButton",slug:"/components/RadioButton/RadioButtonGroup",permalink:"/react-native-paper/docs/components/RadioButton/RadioButtonGroup",draft:!1,editUrl:"https://github.com/callstack/react-native-paper/tree/main/src/components/RadioButton/RadioButtonGroup.tsx",tags:[],version:"current",frontMatter:{title:"RadioButton.Group"},sidebar:"components",previous:{title:"RadioButton.Android",permalink:"/react-native-paper/docs/components/RadioButton/RadioButtonAndroid"},next:{title:"RadioButton.IOS",permalink:"/react-native-paper/docs/components/RadioButton/RadioButtonIOS"}},l={},s=[{value:"Usage",id:"usage",level:2},{value:"Props",id:"props",level:2},{value:"onValueChange (required)",id:"onvaluechange-required",level:3},{value:"value (required)",id:"value-required",level:3},{value:"children (required)",id:"children-required",level:3}],c={toc:s},g="wrapper";function m(o){let{components:e,...t}=o;return(0,a.yg)(g,(0,n.A)({},c,t,{components:e,mdxType:"MDXLayout"}),(0,a.yg)("p",null,"Radio button group allows to control a group of radio buttons."),(0,a.yg)(u.A,{screenshotData:{Android:"screenshots/radio-button-group-android.gif",iOS:"screenshots/radio-button-group-ios.gif"},baseUrl:"/react-native-paper/",mdxType:"ScreenshotTabs"}),(0,a.yg)("h2",{id:"usage"},"Usage"),(0,a.yg)("pre",null,(0,a.yg)("code",{parentName:"pre",className:"language-js"},"import * as React from 'react';\nimport { View } from 'react-native';\nimport { RadioButton, Text } from 'react-native-paper';\n\nconst MyComponent = () => {\n  const [value, setValue] = React.useState('first');\n\n  return (\n    <RadioButton.Group onValueChange={newValue => setValue(newValue)} value={value}>\n      <View>\n        <Text>First</Text>\n        <RadioButton value=\"first\" />\n      </View>\n      <View>\n        <Text>Second</Text>\n        <RadioButton value=\"second\" />\n      </View>\n    </RadioButton.Group>\n  );\n};\n\nexport default MyComponent;\n")),(0,a.yg)("h2",{id:"props"},"Props"),(0,a.yg)("span",null),(0,a.yg)("div",null,(0,a.yg)("h3",{id:"onvaluechange-required"},"onValueChange (required)")),(0,a.yg)(r.A,{componentLink:"RadioButton/RadioButtonGroup",prop:"onValueChange",mdxType:"PropTable"}),(0,a.yg)("div",null,(0,a.yg)("h3",{id:"value-required"},"value (required)")),(0,a.yg)(r.A,{componentLink:"RadioButton/RadioButtonGroup",prop:"value",mdxType:"PropTable"}),(0,a.yg)("div",null,(0,a.yg)("h3",{id:"children-required"},"children (required)")),(0,a.yg)(r.A,{componentLink:"RadioButton/RadioButtonGroup",prop:"children",mdxType:"PropTable"}),(0,a.yg)("span",null),(0,a.yg)("span",null),(0,a.yg)("span",null))}m.isMDXComponent=!0}}]);