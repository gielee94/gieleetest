export const SET_TENANT_ID = "SET_TENANT_ID";

export interface SetTenantIdAction {
  type: typeof SET_TENANT_ID;
  payload: string;
}

export const setTenantId = (tenantId: string): SetTenantIdAction => ({
  type: SET_TENANT_ID,
  payload: tenantId,
});