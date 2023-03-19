import { AbilityBuilder, Ability } from "@casl/ability";

export type Subjects = string;
export type Actions = "manage" | "create" | "read" | "update" | "delete";

export type AppAbility = Ability<[Actions, Subjects]> | undefined;

export const AppAbility = Ability as any;
export type ACLObj = {
  action: Actions;
  subject: string;
};

export enum Role {
  ADMIN = "ADMIN",
  USER = "USER",
  UNPAID_USER = "UNPAID_USER",
  NEW_USER = "NEW_USER"
}

const defineRulesFor = (role: string, subject: string) => {
  const { can, cannot, rules } = new AbilityBuilder(AppAbility);

  if (role === Role.ADMIN) {
    can("manage", "all");
  } else if (role === Role.USER) {
    can("manage", "all");
    cannot(["read"], "admin");
  } else if (role === Role.UNPAID_USER) {
    can("manage", "all");
    cannot(["read"], "admin");
    cannot(["read"], "shipment-add");
    // entity is equal to shipment, address and package
    cannot(["create", "delete", "update"], "entity");
  } else if (role === Role.NEW_USER) {
    cannot(["read", "create", "update", "delete"], subject);
    can(["read"], "init");
  }

  return rules;
};

export const buildAbilityFor = (role: string, subject: string): AppAbility => {
  return new AppAbility(defineRulesFor(role, subject), {
    // https://casl.js.org/v5/en/guide/subject-type-detection
    // @ts-ignore
    detectSubjectType: (object) => object!.type
  });
};

export const defaultACLObj: ACLObj = {
  action: "manage",
  subject: "all"
};

export default defineRulesFor;
