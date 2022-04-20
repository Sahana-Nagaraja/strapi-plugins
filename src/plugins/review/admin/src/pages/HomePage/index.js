import React, { memo, useState, useEffect } from 'react';
import { Layout } from '@strapi/design-system/Layout';
import { Box } from '@strapi/design-system/Box';
import { SubNav, SubNavHeader, SubNavSection, SubNavSections, SubNavLink } from '@strapi/design-system/SubNav';
import {
  MainNav,
  NavSection,
  NavSections,
  NavCondense,
  NavBrand,
  NavUser,
  NavLink,
} from '@strapi/design-system/MainNav';
import ExclamationMarkCircle from '@strapi/icons/ExclamationMarkCircle';
import { request, LoadingIndicatorPage } from "@strapi/helper-plugin";
import get from 'lodash/get';
import ContentType from '../ContentTypes';
import { useRouteMatch } from "react-router-dom";
import Cog from '@strapi/icons/CheckCircle';
import { Divider } from '@strapi/design-system/Divider';

const contentTypeRoutes = () => {
  return (<ContentType />)
}

const approvals = async (slug, kind) => {
  let output = { pending: [], approved: [], rejected: [] };
  try {
    let response = await request(`/content-manager/${kind}/${slug}`);
    let data = await request(`/review/content-status/${slug}`);
    if (kind === 'single-types') {
      response = [response];
    } else {
      response = response.results;
    }
    response = response.filter(data => !data.publishedAt);
    for (let item of response) {
      const contentStatus = data.find(res => res.contentId == item.id);
      if (!contentStatus) {
        output.pending.push(item);
      } else if (contentStatus.status === 'Approved') {
        output.approved.push(item);
      } else {
        output.rejected.push(item);
      }
    }
  } catch (err) {
    console.error("error"+err);
  }
  return output;
}

const HomePage = () => {
  const [singleTypesLinks, setSingleTypesLinks] = useState([]);
  const [collectionTypesLinks, setCollectionTypesLinks] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const { url } = useRouteMatch();
  const [condensed, setCondensed] = useState(false);
  useEffect(async () => {
    let response = await request("/content-manager/content-types", { method: "GET" });
    let { data } = await request(`/admin/users/me`);
    let roles = data.roles && data.roles.map(role => role.code);
    response = get(response, 'data');
    const singleTypes = response.filter(data => data.kind === 'singleType' && data.isDisplayed && data.options.draftAndPublish);
    const collectionTypes = response.filter(data => data.kind === 'collectionType' && data.isDisplayed && data.options.draftAndPublish);
    for (let [index, singleType] of singleTypes.entries()) {
      let counts = await approvals(singleType.uid, "single-types");
      if(roles.includes("strapi-super-admin")) {
        counts = counts.pending.length > 0 ? counts.pending.length : null
      } else{
        console.log(JSON.stringify(counts))
        counts = counts.rejected.length > 0 ? counts.rejected.length : null
      }
      singleTypesLinks.push({
        id: index,
        label: singleType.apiID,
        icon: <ExclamationMarkCircle />,
        slug: singleType.uid,
        type: "singleType",
        counts: counts,
        to: `${url}/singleType/${singleType.uid}?slug=${singleType.uid}&kind=${singleType.kind}`
      })
    }
    for (let [index, collectionType] of collectionTypes.entries()) {
      let counts = await approvals(collectionType.uid, "collection-types");
      if(roles.includes("strapi-super-admin")) {
        counts = counts.pending.length > 0 ? counts.pending.length : null
      } else{
        counts = counts.rejected.length > 0 ? counts.rejected.length : null
      }
      collectionTypesLinks.push({
        id: index,
        label: collectionType.apiID,
        icon: <ExclamationMarkCircle />,
        slug: collectionType.uid,
        type: "collectionType",
        counts: counts,
        to: `${url}/collectionType/${collectionType.uid}?slug=${collectionType.uid}&kind=${collectionType.kind}`
      })
    }
    setSingleTypesLinks(singleTypesLinks);
    setCollectionTypesLinks(collectionTypesLinks);
    setLoading(false);
  }, []);

  if (isLoading) {
    return <LoadingIndicatorPage />;
  }
  return (
    <Box background="neutral100">
      <Layout sideNav={<MainNav ariaLabel="Approvals" condensed={condensed}>
        <NavBrand workplace="TWS" title="Approvals" icon={<img src={"http://localhost:1337/uploads/thumbnail_do_YO_Qtrs_400x400_0374a3a4c2.jpg?width=400&height=400"} alt="" />} />
        <Divider />
        <NavSections>
          <NavSection label="Collection Types">
            {collectionTypesLinks && collectionTypesLinks.map(link => <NavLink to={link.to} active={link.active} key={link.id} icon={<Cog />}
              badgeAriaLabel={`${link.counts}`} badgeContent={link.counts} >
              {link.label}
            </NavLink>
            )}
          </NavSection>
          <NavSection label="Single Types">
            {singleTypesLinks && singleTypesLinks.map(link =>
              <NavLink to={link.to} key={link.id} icon={<Cog />} badgeAriaLabel={`${link.counts}`} badgeContent={link.counts} >
                {link.label}
              </NavLink>)}
          </NavSection>
        </NavSections>
        <NavCondense onClick={() => setCondensed(s => !s)}>
          {condensed ? 'Expanded the navbar' : 'Collapse the navbar'}
        </NavCondense>
      </MainNav>}>
        {contentTypeRoutes()}
      </Layout>
    </Box>);
}

export default memo(HomePage);



// /*
//  *
//  * HomePage
//  *
//  */

// // import PropTypes from 'prop-types';
// import pluginId from '../../pluginId';
// import { Table, Thead, Tbody, Tr, Td, Th } from '@strapi/design-system/Table';
// import { BaseCheckbox } from '@strapi/design-system/BaseCheckbox';
// import { Box } from '@strapi/design-system/Box';
// import { Typography } from '@strapi/design-system/Typography';
// import { VisuallyHidden } from '@strapi/design-system/VisuallyHidden';
// import { Avatar } from '@strapi/design-system/Avatar';
// import { Flex } from '@strapi/design-system/Flex';
// import { IconButton } from '@strapi/design-system/IconButton';
// import { Button } from '@strapi/design-system/Button';
// import { HeaderLayout } from '@strapi/design-system/Layout';
// import Pencil from '@strapi/icons/Pencil';
// import Trash from '@strapi/icons/Trash';
// import { Textarea } from '@strapi/design-system/Textarea';
// import { request, LoadingIndicatorPage } from "@strapi/helper-plugin";
// import get from 'lodash/get';

// import React, { memo, useState, useEffect } from 'react';
// import { Layout } from '@strapi/design-system/Layout';
// import { SubNav, SubNavHeader, SubNavSection, SubNavSections, SubNavLink } from '@strapi/design-system/SubNav';
// import ExclamationMarkCircle from '@strapi/icons/ExclamationMarkCircle';
// import { useRouteMatch } from "react-router-dom";

// const HomePage = () => {

//   const [isLoading, setLoading] = useState(true);
//   const [data, setData] = useState({});
//   useEffect(() => {
//     // request("/content-type-builder/content-types", { method: "GET" }).then(response => {
//     request("/content-manager/collection-types/api::page.page", { method: "GET" }).then(response => {

//       setData(response);
//       console.log("Data:" + JSON.stringify(response));
//       var rows = response.results.length;
//       for (var i = 0; i < rows; i++) {
//         console.log(response.results[i].id)
//       }
//       const column = Object.keys(response.results[0]);
//       console.log(column)
//       setLoading(false);
//     }
//     ).then((data) => {
//       request("/review/content-status/api::page.page", { method: "GET" }).then(response => {
//         setContentStatus(response);
//         setStautsLoading(false);
//       });
//     })
//   }, []);
//   if (isLoading) {
//     return <LoadingIndicatorPage />;
//   }
//   const COL_COUNT = data.results.length;
//   const columns = Object.keys(data.results[0]);
//   const headers = columns.map(
//     (info, i) => {
//       return (
//         <Tr key={i}>
//           <Td>{info}</Td>
//         </Tr>
//       )
//     }
//   );
//   const [contentStatus, setContentStatus] = useState([]);
//   const [isStatusLoading, setStautsLoading] = useState(true);
//   const { url } = useRouteMatch();


//   useEffect(() => {
//     request("/review/content-status/api::page.page", { method: "GET" }).then(response => {
//       setContentStatus(response);
//       setStautsLoading(false);
//     });
//   }, []);

//   const approveContent = () => {

//     console.log('Approving');
//   }

//   const rejectContent = () => {
//     console.log('Rejecting');
//   }
//   return (
//     <Box padding={8} background="neutral100">
//       <HeaderLayout title="Review content" as="h2" />
//       <Table colCount={COL_COUNT} rowCount={10}>
//         <Thead>
//           <Tr>
//             <Th> ID </Th>
//             <Th> Title </Th>
//             <Th> Content </Th>
//             <Th> Update at</Th>
//             <Th> Created by</Th>
//             <Th></Th>
//             <Th></Th>
//             <Th>Comments</Th>
//           </Tr>
//         </Thead>
//         <Tbody>
//           {data.results.map(entry => <Tr key={entry.id}>
//             <Td>
//               <Typography textColor="neutral800">{entry.id}</Typography>
//             </Td>
//             <Td>
//               <Typography textColor="neutral800">{entry.Title}</Typography>
//             </Td>
//             <Td>
//               <Typography textColor="neutral800">{entry.Content}</Typography>
//             </Td>
//             <Td>
//               <Typography textColor="neutral800">{entry.updatedAt}</Typography>
//             </Td>
//             <Td>
//               <Typography textColor="neutral800">{entry.createdBy.firstname} {entry.createdBy.lastname}</Typography>
//             </Td>
//             <Td><Button onClick={approveContent} variant='success'>Approve</Button></Td>
//             <Td><Button onClick={rejectContent} variant='danger'>Reject</Button></Td>
//             <Td>
//               <Textarea placeholder="Add your comments" name="comment"
//                 onChange={e => setContent(e.target.value)}
//               >
//               </Textarea>
//             </Td>
//           </Tr>)}
//         </Tbody>
//       </Table>
//     </Box>
//   )

// }

// export default memo(HomePage);