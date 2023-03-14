import HomeOutline from "mdi-material-ui/HomeOutline";
import HomeCityOutline from "mdi-material-ui/HomeCityOutline";
import PackageVariantClosed from "mdi-material-ui/PackageVariantClosed";
import TruckFastOutline from "mdi-material-ui/TruckFastOutline";

import { VerticalNavItemsType } from "src/@core/layouts/types";

const navigation = (): VerticalNavItemsType => {
  return [
    {
      title: "Home",
      icon: HomeOutline,
      path: "/home"
    },
    {
      title: "Shipments",
      icon: TruckFastOutline,
      children: [
        {
          title: "My Labels",
          path: "/shipments/list"
        },
        {
          title: "Create Label",
          path: "/shipments/add",
          action: "read",
          subject: "shipment-add"
        }
      ]
    },
    {
      title: "Parcels",
      icon: PackageVariantClosed,
      path: "/packages/list"
    },
    {
      title: "Addresses",
      icon: HomeCityOutline,
      path: "/addresses/list"
    }
  ];
};

export default navigation;
