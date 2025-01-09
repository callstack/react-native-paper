"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[5051],{34825:(e,o,n)=>{n.r(o),n.d(o,{assets:()=>p,contentTitle:()=>r,default:()=>u,frontMatter:()=>s,metadata:()=>c,toc:()=>g});var t=n(58168),i=(n(96540),n(15680)),a=n(27450),l=(n(51597),n(86315),n(72584));const s={title:"Dialog.Actions"},r=void 0,c={unversionedId:"components/Dialog/DialogActions",id:"components/Dialog/DialogActions",title:"Dialog.Actions",description:"A component to show a list of actions in a Dialog.",source:"@site/docs/components/Dialog/DialogActions.mdx",sourceDirName:"components/Dialog",slug:"/components/Dialog/DialogActions",permalink:"/react-native-paper/docs/components/Dialog/DialogActions",draft:!1,editUrl:"https://github.com/callstack/react-native-paper/tree/main/src/components/Dialog/DialogActions.tsx",tags:[],version:"current",frontMatter:{title:"Dialog.Actions"},sidebar:"components",previous:{title:"Dialog",permalink:"/react-native-paper/docs/components/Dialog/"},next:{title:"Dialog.Content",permalink:"/react-native-paper/docs/components/Dialog/DialogContent"}},p={},g=[{value:"Usage",id:"usage",level:2},{value:"Props",id:"props",level:2},{value:"children (required)",id:"children-required",level:3},{value:"style",id:"style",level:3},{value:"theme",id:"theme",level:3}],d={toc:g},m="wrapper";function u(e){let{components:o,...n}=e;return(0,i.yg)(m,(0,t.A)({},d,n,{components:o,mdxType:"MDXLayout"}),(0,i.yg)("p",null,"A component to show a list of actions in a Dialog."),(0,i.yg)(l.A,{screenshotData:"screenshots/dialog-actions.png",baseUrl:"/react-native-paper/",mdxType:"ScreenshotTabs"}),(0,i.yg)("h2",{id:"usage"},"Usage"),(0,i.yg)("pre",null,(0,i.yg)("code",{parentName:"pre",className:"language-js"},"import * as React from 'react';\nimport { Button, Dialog, Portal } from 'react-native-paper';\n\nconst MyComponent = () => {\n  const [visible, setVisible] = React.useState(false);\n\n  const hideDialog = () => setVisible(false);\n\n  return (\n    <Portal>\n      <Dialog visible={visible} onDismiss={hideDialog}>\n        <Dialog.Actions>\n          <Button onPress={() => console.log('Cancel')}>Cancel</Button>\n          <Button onPress={() => console.log('Ok')}>Ok</Button>\n        </Dialog.Actions>\n      </Dialog>\n    </Portal>\n  );\n};\n\nexport default MyComponent;\n")),(0,i.yg)("h2",{id:"props"},"Props"),(0,i.yg)("span",null),(0,i.yg)("div",null,(0,i.yg)("h3",{id:"children-required"},"children (required)")),(0,i.yg)(a.A,{componentLink:"Dialog/DialogActions",prop:"children",mdxType:"PropTable"}),(0,i.yg)("div",null,(0,i.yg)("h3",{id:"style"},"style")),(0,i.yg)(a.A,{componentLink:"Dialog/DialogActions",prop:"style",mdxType:"PropTable"}),(0,i.yg)("div",null,(0,i.yg)("h3",{id:"theme"},"theme")),(0,i.yg)(a.A,{componentLink:"Dialog/DialogActions",prop:"theme",mdxType:"PropTable"}),(0,i.yg)("span",null),(0,i.yg)("span",null),(0,i.yg)("span",null))}u.isMDXComponent=!0}}]);