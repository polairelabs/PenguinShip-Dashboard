// ** Icon imports
import HomeOutline from "mdi-material-ui/HomeOutline";
import EmailOutline from "mdi-material-ui/EmailOutline";
import ShieldOutline from "mdi-material-ui/ShieldOutline";
import OfficeBuildingOutline from "mdi-material-ui/OfficeBuildingOutline";
import ArchiveOutline from "mdi-material-ui/ArchiveOutline";

// ** Type import
import { VerticalNavItemsType } from "src/@core/layouts/types";

const navigation = (): VerticalNavItemsType => {
  return [
    {
      title: "Home",
      icon: HomeOutline,
      path: "/home"
    },
    {
      title: "Packages",
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
          title: "Add",
          path: "/shipments/add"
        },
        {
          title: "List",
          path: "/shipments/list"
        }
      ]
    },
  ];
};

export default navigation;
