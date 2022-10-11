// ** Icon imports
import HomeOutline from "mdi-material-ui/HomeOutline";
import EmailOutline from "mdi-material-ui/EmailOutline";
import ShieldOutline from "mdi-material-ui/ShieldOutline";

// ** Type import
import { HorizontalNavItemsType } from "src/@core/layouts/types";

const navigation = (): HorizontalNavItemsType => [
  {
    title: "Home",
    icon: HomeOutline,
    action: "read",
    path: "/home"
  },
  {
    title: "Second Page",
    icon: EmailOutline,
    action: "read",
    path: "/second-page"
  },
  {
    title: "Access Control",
    icon: ShieldOutline,
    path: "/acl",
    action: "read",
    subject: "acl-page"
  },
  {
    title: "Packages",
    icon: ShieldOutline,
    path: "/acl",
    action: "read",
    subject: "acl-page"
  },
  {
    title: "Addresses",
    icon: ShieldOutline,
    path: "/acl",
    action: "read",
    subject: "acl-page"
  },
  {
    title: "Shipments",
    icon: ShieldOutline,
    path: "/acl",
    action: "read",
    subject: "acl-page"
  }
];

export default navigation;
