import React, { memo, useCallback, useState, useEffect } from 'react';
import { ActionLayout, HeaderLayout, ContentLayout } from '@strapi/design-system/Layout';
import { Button } from '@strapi/design-system/Button';
import { Table, Thead, Tbody, Tr, Td, Th, TFooter } from '@strapi/design-system/Table';
import { Typography } from '@strapi/design-system/Typography';
import { VisuallyHidden } from '@strapi/design-system/VisuallyHidden';
import { BaseCheckbox } from '@strapi/design-system/BaseCheckbox';
import { Flex } from '@strapi/design-system/Flex';
import { request } from "@strapi/helper-plugin";
import _ from 'lodash';
import { PreviousLink, PageLink, NextLink, Pagination } from '@strapi/design-system/Pagination';
import { NavLink, useLocation } from 'react-router-dom';
import { Textarea } from '@strapi/design-system/Textarea';


const ApprovePage = () => {
    const [checkedItems, setCheckedItems] = useState(new Map());
    const [tHeads, setTHeads] = useState([]);
    const [tData, setTData] = useState([]);
    const [contents, setContents] = useState([]);
    const { search } = useLocation();

    useEffect(async () => {
        await approvalContents();
    }, [search]);

    const approvalContents = useCallback(async () => {
        const slug = new URLSearchParams(search).get("slug");
        const kind = new URLSearchParams(search).get("kind");
        const type = kind === 'collectionType' ? 'collection-types' : 'single-types';
        let data = await request(`/content-manager/${type}/${slug}`, { method: "GET" });
        let contentStatus = await request(`/review/content-status/${slug}`);
        let contentTypes = [];
        if (kind === 'singleType') data = [data];
        else data = data.results;
        data = data.filter(data => !data.publishedAt);
        setContents(data);
        for (let item of data) {
            let temp ;
            if (contentStatus && contentStatus.length && contentStatus.length > 0) {
                temp = contentStatus.find(res => res.contentId == item.id);
            } else {
                temp = null;
            }
            if (!temp) {
                contentTypes.push({
                    id: item.id,
                    createdBy: item.createdBy && item.createdBy.firstname + " " + item.createdBy.lastname,
                    updatedBy: item.updatedBy && item.updatedBy.firstname + " " + item.updatedBy.lastname,
                    updatedAt: item.updatedAt,
                    contentName: slug
                })
            }
        }
        setTHeads(Object.keys(contentTypes && !_.isEmpty(contentTypes[0]) ? contentTypes[0] : []));
        setTData(contentTypes);
    }, [search, tData])

    const viewContent = (id) => {
        const kind = new URLSearchParams(search).get("kind");
        const slug = new URLSearchParams(search).get("slug");
        if (kind == "collectionType") {
            window.open(`http://${window.location.host}/admin/content-manager/${kind}/${slug}/${id}`);
        } else {
            window.open(`http://${window.location.host}/admin/content-manager/${kind}/${slug}`);
        }
    };
    const setComments = (id, value) => {
        let data = tData;
        const index = data.findIndex(res => res.id == id);
        data[index].comments = value;
        setTData(data);
    }

    const checkContentTypes = useCallback((data, index, value) => {
        let tempItemIndex = [];
        if (value) {
            checkedItems.set(index, data);
            tempItemIndex.push(index);
            if (tempItemIndex.length >= 3) {
                const itemToRemove = tempItemIndex.shift();
                checkedItems.delete(itemToRemove);
            }
        } else {
            tempItemIndex = tempItemIndex.filter(function (ele) {
                return ele != index;
            });
            checkedItems.delete(index);
        }
        setCheckedItems(new Map(checkedItems));
    }, [checkedItems])

    const tableData = () => {
        return tData.map((data, index) => {
            return (
                <Tr >
                    <Td><BaseCheckbox aria-label={`Select ${data[tHeads[0]]}`}
                        onValueChange={(value) => checkContentTypes(data, index, value)} value={checkedItems.get(index)} /></Td>
                    {tHeads.map((head) => {
                        if (_.isObject(data[head])) {
                            return <Td><Typography textColor="neutral800">{
                                "-"
                                // JSON.stringify(data[head])
                            }</Typography></Td>
                        } else {
                            return <Td><Typography textColor="neutral800" style={{
                                'white-space': 'nowrap', 'max-width': '150px', display: 'block',
                                'overflow': 'hidden',
                                'text-overflow': 'ellipsis'
                            }}>{data[head]}</Typography></Td>
                        }
                    })}

                    <Td>
                        <Textarea placeholder="Add your comments" name="comment" style={{ 'min-width': '200px' }}
                            onChange={(e) => setComments(data.id, e.target.value)} value={data.comments}>
                        </Textarea></Td>
                    <Td><Flex>
                        <Button onClick={() => viewContent(data.id)} variant='primary' >View</Button>&nbsp;&nbsp;
                        <Button onClick={() => approveContent(data.id)} variant='success'>Approve</Button>&nbsp;&nbsp;
                        <Button onClick={() => rejectContent(data.id)} variant='danger'>Reject</Button>
                    </Flex></Td>
                </Tr>
            )
        })
    }

    const tHeadData = () => {
        return tHeads.map((head) => {
            return <Th> <Typography variant="sigma">{head}</Typography></Th>
        })
    }


    const getTablePaginations = () => {
        return (
            <Pagination>
                <PreviousLink as={NavLink} to="/plugins/version-manager/1">
                    Previous
                </PreviousLink>
                <PageLink as={NavLink} to="/plugins/version-manager/1">
                    1
                </PageLink>
                <PageLink as={NavLink} to="/plugins/version-manager/2">
                    2
                </PageLink>
                <NextLink as={NavLink} to="/plugins/version-manager/2">
                    Next page
                </NextLink>
            </Pagination>
        )
    }

    const approveContent = async (id) => {
        const slug = new URLSearchParams(search).get("slug");
        let kind = new URLSearchParams(search).get("kind");
        kind = kind === 'collectionType' ? 'collection-types' : 'single-types';
        const content = contents.find(res => res.id == id);
        const contentStatus = tData.find(res => res.id == id);
        content.publishedAt = new Date();
        await request(`/review/content-status/${kind}/${slug}`, {
            method: "POST", body: {
                contents: content, contentStatus: {
                    status: "Approved", comments: contentStatus.comments
                }
            }
        });
        await approvalContents();
    }

    const rejectContent = async (id) => {
        const slug = new URLSearchParams(search).get("slug");
        let kind = new URLSearchParams(search).get("kind");
        kind = kind === 'collectionType' ? 'collection-types' : 'single-types';
        const content = contents.find(res => res.id == id);
        const contentStatus = tData.find(res => res.id == id);
        await request(`/review/content-status/${kind}/${slug}`, {
            method: "POST", body: {
                contents: content, contentStatus: {
                    status: "Rejected", comments: contentStatus.comments
                }
            }
        });
        await approvalContents();
    }

    if (tData && tData.length > 0) {
        return (<>
            <HeaderLayout primaryAction={<></>} secondaryAction={<></>}
                title="Approvals" subtitle="Select for bulk approvals . " as="h2" />
            <ActionLayout startActions={<Button disabled={checkedItems.size !== 2} onClick={() => { }} >Approve</Button>}
                endActions={<Button disabled={checkedItems.size !== 2} onClick={() => { }} >Reject</Button>} />
            <ContentLayout>
                <Table colCount={tHeads.length} rowCount={tData.length}
                    footer={<TFooter>{getTablePaginations()}</TFooter>}>
                    <Thead>
                        <Tr>
                            <Th><VisuallyHidden>Checkbox</VisuallyHidden></Th>
                            {tHeadData()}
                            <Th><Typography variant="sigma">Comments </Typography></Th>
                            <Th><VisuallyHidden>Actions</VisuallyHidden> </Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {tableData()}
                    </Tbody>
                </Table>
            </ContentLayout>
        </>)
    } else {
        return (<div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
            No content found
        </div>)
    }
}

export default memo(ApprovePage);
