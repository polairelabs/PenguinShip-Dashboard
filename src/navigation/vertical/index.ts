import { VerticalNavItemsType } from "src/@core/layouts/types";

const navigation = (): VerticalNavItemsType => {
  return [
    {
      title: "Home",
      icon: "mdi:home-outline",
      path: "/home"
    },
    {
      title: "Parcels",
      icon: "mdi:archive-outline",
      path: "/packages/list"
    },
    {
      title: "Addresses",
      icon: "mdi:office-building-outline",
      path: "/addresses/list"
    },
    {
      title: "Shipments",
      icon: "mdi:shield-outline",
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
    },
  ];
};

export default navigation;
