// ** MUI Imports
import Grid from '@mui/material/Grid'

// ** Demo Components
import CurrentPlanCard from 'src/views/pages/account-settings/billing/CurrentPlanCard'
import { Membership } from "../../../types/apps/NavashipTypes";

const TabBilling = ({ apiPricingPlanData }: { apiPricingPlanData: Membership[] }) => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <CurrentPlanCard data={apiPricingPlanData} />
      </Grid>
    </Grid>
  )
}

export default TabBilling
