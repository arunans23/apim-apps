/*
 *  Copyright (c) 2020, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 *  WSO2 Inc. licenses this file to you under the Apache License,
 *  Version 2.0 (the "License"); you may not use this file except
 *  in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

package org.wso2.carbon.apimgt.rest.api.gateway.v1.impl;

import org.json.JSONObject;
import org.wso2.carbon.apimgt.gateway.InMemoryAPIDeployer;
import org.wso2.carbon.apimgt.impl.APIConstants;
import org.wso2.carbon.apimgt.rest.api.gateway.v1.*;
import org.apache.cxf.jaxrs.ext.MessageContext;

import javax.ws.rs.core.Response;
import java.util.Map;

public class UndeployApiApiServiceImpl implements UndeployApiApiService {
    private final String SUPER_TENAT_DOMAIN = "carbon.super";

    public Response undeployApiPost(String apiName, String version , String tenantDomain,
            MessageContext messageContext) {

        InMemoryAPIDeployer inMemoryApiDeployer = new InMemoryAPIDeployer();
        if (tenantDomain == null){
            tenantDomain =SUPER_TENAT_DOMAIN;
        }
        Map<String, String> apiAttributes = inMemoryApiDeployer.getGatewayAPIAttributes(apiName, version, tenantDomain);
        String apiId = apiAttributes.get(APIConstants.GatewayArtifactSynchronizer.API_ID);
        String label = apiAttributes.get(APIConstants.GatewayArtifactSynchronizer.LABEL);
        boolean status = inMemoryApiDeployer.unDeployAPI(apiId, label);

        JSONObject responseObj = new JSONObject();
        if (status) {
            responseObj.put("Message", "Success");
            String responseStringObj = String.valueOf(responseObj);
            return Response.ok().entity(responseStringObj).build();
        } else {
            responseObj.put("Message", "Error");
            String responseStringObj = String.valueOf(responseObj);
            return Response.serverError().entity(responseStringObj).build();
        }
    }
}
