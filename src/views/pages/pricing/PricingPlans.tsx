// ** MUI Imports
import Grid from '@mui/material/Grid'

// ** Custom Components Imports
import PlanDetails from 'src/@core/components/plan-details'

// ** Types
import { PricingPlanType } from 'src/@core/components/plan-details/types'
import { Membership } from "../../../types/apps/NavashipTypes";

interface Props {
  data: Membership[] | null
}

const PricingPlans = (props: Props) => {
  // ** Props
  const { data } = props;

  return (
    <Grid container spacing={6}>
      {data?.map((item: Membership) => (
        <Grid item xs={12} md={4} key={item.name.toLowerCase()}>
          <PlanDetails data={item} />
        </Grid>
      ))}
    </Grid>
  )
}

export default PricingPlans
