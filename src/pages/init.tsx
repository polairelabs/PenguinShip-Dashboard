import MembershipSelectDialog from "../components/dialog/membershipSelectDialog";

const InitPage = () => {
  return <MembershipSelectDialog />;
};

InitPage.acl = {
  action: "read",
  subject: "init"
};

export default InitPage;
