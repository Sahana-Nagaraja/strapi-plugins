import React, { memo, useEffect, useState } from 'react';
import { request } from "@strapi/helper-plugin";
import ApprovePage from './approver';
import RequestApproval from './requestApproval';

const ContentType = () => {
    const [roles, setRoles] = useState([]);
    useEffect(async () => {
        let { data } = await request(`/admin/users/me`);
        let roles = data.roles && data.roles.map(role => role.code);
        setRoles(roles);
    }, []);

    if (roles.includes("strapi-super-admin")) {
        return (<ApprovePage />)
    } else {
        return (<RequestApproval />)
    }
}

export default memo(ContentType);
