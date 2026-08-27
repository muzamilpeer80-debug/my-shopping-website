import{c as i,r as s,j as e,L as a}from"./index-DtiaWPpF.js";/**
 * @license lucide-react v0.446.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const c=i("ChevronRight",[["path",{d:"m9 18 6-6-6-6",key:"mthhwq"}]]);function m({crumbs:n}){const[r,o]=s.useState(!1);return s.useEffect(()=>o(!0),[]),e.jsxs("nav",{className:`flex items-center gap-2 text-xs uppercase tracking-[0.15em] text-ink-400 transition-opacity duration-500 ${r?"opacity-100":"opacity-0"}`,children:[e.jsx(a,{to:"/",className:"hover:text-ink-900 transition-colors",children:"Home"}),n.map(t=>e.jsxs("span",{className:"flex items-center gap-2",children:[e.jsx(c,{className:"w-3 h-3"}),t.to?e.jsx(a,{to:t.to,className:"hover:text-ink-900 transition-colors",children:t.label}):e.jsx("span",{className:"text-ink-700",children:t.label})]},t.label))]})}export{m as B};
