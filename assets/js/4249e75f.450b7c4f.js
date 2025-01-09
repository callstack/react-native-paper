"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[5797],{89556:(e,a,n)=>{n.r(a),n.d(a,{assets:()=>s,contentTitle:()=>r,default:()=>c,frontMatter:()=>p,metadata:()=>g,toc:()=>b});var t=n(58168),o=(n(96540),n(15680)),l=n(27450),i=(n(51597),n(86315),n(72584));const p={title:"DataTable.Pagination"},r=void 0,g={unversionedId:"components/DataTable/DataTablePagination",id:"components/DataTable/DataTablePagination",title:"DataTable.Pagination",description:"A component to show pagination for data table.",source:"@site/docs/components/DataTable/DataTablePagination.mdx",sourceDirName:"components/DataTable",slug:"/components/DataTable/DataTablePagination",permalink:"/react-native-paper/docs/components/DataTable/DataTablePagination",draft:!1,editUrl:"https://github.com/callstack/react-native-paper/tree/main/src/components/DataTable/DataTablePagination.tsx",tags:[],version:"current",frontMatter:{title:"DataTable.Pagination"},sidebar:"components",previous:{title:"DataTable.Header",permalink:"/react-native-paper/docs/components/DataTable/DataTableHeader"},next:{title:"DataTable.Row",permalink:"/react-native-paper/docs/components/DataTable/DataTableRow"}},s={},b=[{value:"Usage",id:"usage",level:2},{value:"Props",id:"props",level:2},{value:"page (required)",id:"page-required",level:3},{value:"numberOfPages (required)",id:"numberofpages-required",level:3},{value:"onPageChange (required)",id:"onpagechange-required",level:3},{value:"showFastPaginationControls",id:"showfastpaginationcontrols",level:3},{value:"paginationControlRippleColor",id:"paginationcontrolripplecolor",level:3},{value:"theme",id:"theme",level:3},{value:"numberOfItemsPerPage",id:"numberofitemsperpage",level:3},{value:"numberOfItemsPerPageList",id:"numberofitemsperpagelist",level:3},{value:"onItemsPerPageChange",id:"onitemsperpagechange",level:3},{value:"dropdownItemRippleColor",id:"dropdownitemripplecolor",level:3},{value:"selectPageDropdownRippleColor",id:"selectpagedropdownripplecolor",level:3},{value:"selectPageDropdownLabel",id:"selectpagedropdownlabel",level:3},{value:"selectPageDropdownAccessibilityLabel",id:"selectpagedropdownaccessibilitylabel",level:3},{value:"label",id:"label",level:3},{value:"accessibilityLabel",id:"accessibilitylabel",level:3},{value:"style",id:"style",level:3}],m={toc:b},d="wrapper";function c(e){let{components:a,...n}=e;return(0,o.yg)(d,(0,t.A)({},m,n,{components:a,mdxType:"MDXLayout"}),(0,o.yg)("p",null,"A component to show pagination for data table."),(0,o.yg)(i.A,{screenshotData:"screenshots/data-table-pagination.png",baseUrl:"/react-native-paper/",mdxType:"ScreenshotTabs"}),(0,o.yg)("h2",{id:"usage"},"Usage"),(0,o.yg)("pre",null,(0,o.yg)("code",{parentName:"pre",className:"language-js"},"import * as React from 'react';\nimport { DataTable } from 'react-native-paper';\n\nconst numberOfItemsPerPageList = [2, 3, 4];\n\nconst items = [\n  {\n    key: 1,\n    name: 'Page 1',\n  },\n  {\n    key: 2,\n    name: 'Page 2',\n  },\n  {\n    key: 3,\n    name: 'Page 3',\n  },\n];\n\nconst MyComponent = () => {\n  const [page, setPage] = React.useState(0);\n  const [numberOfItemsPerPage, onItemsPerPageChange] = React.useState(numberOfItemsPerPageList[0]);\n  const from = page * numberOfItemsPerPage;\n  const to = Math.min((page + 1) * numberOfItemsPerPage, items.length);\n\n  React.useEffect(() => {\n     setPage(0);\n  }, [numberOfItemsPerPage]);\n\n  return (\n    <DataTable>\n      <DataTable.Pagination\n        page={page}\n        numberOfPages={Math.ceil(items.length / numberOfItemsPerPage)}\n        onPageChange={page => setPage(page)}\n        label={`${from + 1}-${to} of ${items.length}`}\n        showFastPaginationControls\n        numberOfItemsPerPageList={numberOfItemsPerPageList}\n        numberOfItemsPerPage={numberOfItemsPerPage}\n        onItemsPerPageChange={onItemsPerPageChange}\n        selectPageDropdownLabel={'Rows per page'}\n      />\n    </DataTable>\n  );\n};\n\nexport default MyComponent;\n")),(0,o.yg)("h2",{id:"props"},"Props"),(0,o.yg)("span",null),(0,o.yg)("div",null,(0,o.yg)("h3",{id:"page-required"},"page (required)")),(0,o.yg)(l.A,{componentLink:"DataTable/DataTablePagination",prop:"page",mdxType:"PropTable"}),(0,o.yg)("div",null,(0,o.yg)("h3",{id:"numberofpages-required"},"numberOfPages (required)")),(0,o.yg)(l.A,{componentLink:"DataTable/DataTablePagination",prop:"numberOfPages",mdxType:"PropTable"}),(0,o.yg)("div",null,(0,o.yg)("h3",{id:"onpagechange-required"},"onPageChange (required)")),(0,o.yg)(l.A,{componentLink:"DataTable/DataTablePagination",prop:"onPageChange",mdxType:"PropTable"}),(0,o.yg)("div",null,(0,o.yg)("h3",{id:"showfastpaginationcontrols"},"showFastPaginationControls")),(0,o.yg)(l.A,{componentLink:"DataTable/DataTablePagination",prop:"showFastPaginationControls",mdxType:"PropTable"}),(0,o.yg)("div",null,(0,o.yg)("h3",{id:"paginationcontrolripplecolor"},"paginationControlRippleColor")),(0,o.yg)(l.A,{componentLink:"DataTable/DataTablePagination",prop:"paginationControlRippleColor",mdxType:"PropTable"}),(0,o.yg)("div",null,(0,o.yg)("h3",{id:"theme"},"theme")),(0,o.yg)(l.A,{componentLink:"DataTable/DataTablePagination",prop:"theme",mdxType:"PropTable"}),(0,o.yg)("div",null,(0,o.yg)("h3",{id:"numberofitemsperpage"},"numberOfItemsPerPage")),(0,o.yg)(l.A,{componentLink:"DataTable/DataTablePagination",prop:"numberOfItemsPerPage",mdxType:"PropTable"}),(0,o.yg)("div",null,(0,o.yg)("h3",{id:"numberofitemsperpagelist"},"numberOfItemsPerPageList")),(0,o.yg)(l.A,{componentLink:"DataTable/DataTablePagination",prop:"numberOfItemsPerPageList",mdxType:"PropTable"}),(0,o.yg)("div",null,(0,o.yg)("h3",{id:"onitemsperpagechange"},"onItemsPerPageChange")),(0,o.yg)(l.A,{componentLink:"DataTable/DataTablePagination",prop:"onItemsPerPageChange",mdxType:"PropTable"}),(0,o.yg)("div",null,(0,o.yg)("h3",{id:"dropdownitemripplecolor"},"dropdownItemRippleColor")),(0,o.yg)(l.A,{componentLink:"DataTable/DataTablePagination",prop:"dropdownItemRippleColor",mdxType:"PropTable"}),(0,o.yg)("div",null,(0,o.yg)("h3",{id:"selectpagedropdownripplecolor"},"selectPageDropdownRippleColor")),(0,o.yg)(l.A,{componentLink:"DataTable/DataTablePagination",prop:"selectPageDropdownRippleColor",mdxType:"PropTable"}),(0,o.yg)("div",null,(0,o.yg)("h3",{id:"selectpagedropdownlabel"},"selectPageDropdownLabel")),(0,o.yg)(l.A,{componentLink:"DataTable/DataTablePagination",prop:"selectPageDropdownLabel",mdxType:"PropTable"}),(0,o.yg)("div",null,(0,o.yg)("h3",{id:"selectpagedropdownaccessibilitylabel"},"selectPageDropdownAccessibilityLabel")),(0,o.yg)(l.A,{componentLink:"DataTable/DataTablePagination",prop:"selectPageDropdownAccessibilityLabel",mdxType:"PropTable"}),(0,o.yg)("div",null,(0,o.yg)("h3",{id:"label"},"label")),(0,o.yg)(l.A,{componentLink:"DataTable/DataTablePagination",prop:"label",mdxType:"PropTable"}),(0,o.yg)("div",null,(0,o.yg)("h3",{id:"accessibilitylabel"},"accessibilityLabel")),(0,o.yg)(l.A,{componentLink:"DataTable/DataTablePagination",prop:"accessibilityLabel",mdxType:"PropTable"}),(0,o.yg)("div",null,(0,o.yg)("h3",{id:"style"},"style")),(0,o.yg)(l.A,{componentLink:"DataTable/DataTablePagination",prop:"style",mdxType:"PropTable"}),(0,o.yg)("span",null),(0,o.yg)("span",null),(0,o.yg)("span",null))}c.isMDXComponent=!0}}]);