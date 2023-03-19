import {
  GetStaticPaths,
  GetStaticProps,
  GetStaticPropsContext,
  InferGetStaticPropsType
} from "next/types";
import AdminSettings from "src/views/pages/admin-panel/AdminSettings";

const AdminSettingsTab = ({
  tab,
  // apiPricingPlanData
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  return <AdminSettings tab={tab} /* apiPricingPlanData={apiPricingPlanData} */ />;
};

export const getStaticPaths: GetStaticPaths = () => {
  return {
    paths: [{ params: { tab: "edit-memberships" } }],
    fallback: false
  };
};

export const getStaticProps: GetStaticProps = async ({
  params
}: GetStaticPropsContext) => {
  return {
    props: {
      tab: params?.tab
      // You can pass props here
      // apiPricingPlanData: {}
    }
  };
};

AdminSettingsTab.acl = {
  action: "read",
  subject: "admin"
};

export default AdminSettingsTab;
