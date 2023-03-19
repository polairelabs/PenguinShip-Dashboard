import { useEffect } from "react";
import MembershipSelectDialog from "../components/dialog/membershipSelectDialog";

const InitPage = () => {

  useEffect(() => {
  }, []);

  return <MembershipSelectDialog />;
};

InitPage.acl = {
  action: "read",
  subject: "init"
};

export default InitPage;
