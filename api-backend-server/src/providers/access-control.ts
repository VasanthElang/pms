import { AccessControl, Permission } from 'accesscontrol';
import { grantList } from '../definitions/rbac';
// grant list fetched from DB (to be converted to a valid grants object, internally)
const ac = new AccessControl(grantList);
ac.grant('admin').extend(['user']);
// user role inherits viewer role permissions
export const extend = (role: string | string[], permissions: string | string[]) => ac.grant(role).extend(permissions);
export const canRead = (role: string | string[], resource: string):Permission => {
  let permission: Permission;
  if (ac.can(role).read(resource)) permission = ac.can(role).read(resource);
  if (ac.can(role).readAny(resource))permission = ac.can(role).readOwn(resource);
  if (ac.can(role).readOwn(resource)) permission = ac.can(role).readOwn(resource);
  return permission;
};
export const canCreate = (role: string | string[], resource: string):Permission => {
  let permission: Permission;
  if (ac.can(role).create(resource)) permission = ac.can(role).create(resource);
  if (ac.can(role).createAny(resource))permission = ac.can(role).createAny(resource);
  if (ac.can(role).createOwn(resource)) permission = ac.can(role).createOwn(resource);
  return permission;
};
export const canUpdate = (role: string | string[], resource: string):Permission => {
  let permission: Permission;
  if (ac.can(role).update(resource)) permission = ac.can(role).update(resource);
  if (ac.can(role).updateAny(resource))permission = ac.can(role).updateAny(resource);
  if (ac.can(role).updateOwn(resource)) permission = ac.can(role).updateOwn(resource);
  return permission;
};
export const canDelete = (role: string | string[], resource: string):Permission => {
  let permission: Permission;
  if (ac.can(role).delete(resource)) permission = ac.can(role).delete(resource);
  if (ac.can(role).deleteAny(resource))permission = ac.can(role).deleteAny(resource);
  if (ac.can(role).deleteOwn(resource)) permission = ac.can(role).deleteOwn(resource);
  return permission;
};
