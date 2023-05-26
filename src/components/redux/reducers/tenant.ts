import { SET_TENANT_ID, SetTenantIdAction } from '../actions/tenant';

const initialState: string = '';

export function tenantReducer(state = initialState, action: SetTenantIdAction): string {
  switch (action.type) {
    case SET_TENANT_ID:
      return action.payload;
    default:
      return state;
  }
};

