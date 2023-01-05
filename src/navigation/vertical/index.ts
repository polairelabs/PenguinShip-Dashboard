import HomeOutline from "mdi-material-ui/HomeOutline";
import ShieldOutline from "mdi-material-ui/ShieldOutline";
import OfficeBuildingOutline from "mdi-material-ui/OfficeBuildingOutline";
import ArchiveOutline from "mdi-material-ui/ArchiveOutline";

import { VerticalNavItemsType } from "src/@core/layouts/types";

const navigation = (): VerticalNavItemsType => {
  return [
    {
      title: "Home",
      icon: HomeOutline,
      path: "/home"
    },
    {
      title: "Parcels",
      icon: ArchiveOutline,
      path: "/packages/list"
    },
    {
      title: "Addresses",
      icon: OfficeBuildingOutline,
      path: "/addresses/list"
    },
    {
      title: "Shipments",
      icon: ShieldOutline,
      children: [
        {
          title: "Create Label",
          path: "/shipments/add"
        },
        {
          title: "My Labels",
          path: "/shipments/list"
        }
      ]
    }
  ];
};

export default navigation;
