// ** Next Import
import { GetStaticProps, GetStaticPaths, GetStaticPropsContext, InferGetStaticPropsType } from 'next/types'

// ** Third Party Imports
import axios from 'axios'

// ** Types
import { PricingDataType } from 'src/@core/components/plan-details/types'

// ** Demo Components Imports
import AccountSettings from 'src/views/pages/account-settings/AccountSettings'
import BaseApi from "../../api/api";
import { Membership } from "../../types/apps/NavashipTypes";

const AccountSettingsTab = ({ tab, apiPricingPlanData }: InferGetStaticPropsType<typeof getStaticProps>) => {
  return <AccountSettings tab={tab} apiPricingPlanData={apiPricingPlanData} />
}

export const getStaticPaths: GetStaticPaths = () => {
  return {
    paths: [
      { params: { tab: 'security' } },
      { params: { tab: 'billing' } },
    ],
    fallback: false
  }
}

export const getStaticProps: GetStaticProps = async ({ params }: GetStaticPropsContext) => {
  try {
    const res = await BaseApi.get("/subscriptions/");
    const data: Membership[] = res.data;
    // Check if the data is defined and not empty.
    if (!data || data.length === 0) {
      return {
        notFound: true,
      };
    }
    return {
      props: {
        tab: params?.tab,
        apiPricingPlanData: data
      }
    }
  } catch (error) {
  console.error('Error fetching data:', error);

  // Return notFound if there's an error fetching data.
  return {
    notFound: true,
  };
}

}

export default AccountSettingsTab
