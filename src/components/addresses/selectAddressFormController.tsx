import Grid from "@mui/material/Grid";
import FormControl from "@mui/material/FormControl";
import { Controller } from "react-hook-form";
import { Autocomplete, Box, Typography } from "@mui/material";
import TextField from "@mui/material/TextField";
import FormHelperText from "@mui/material/FormHelperText";
import { Address } from "../../types/apps/navashipInterfaces";
import { ChangeEvent } from "react";

export enum AddressType {
  SOURCE = "source",
  DELIVERY = "delivery"
}

interface AddressSelectProps {
  addressType: AddressType;
  currentAddress: Address | null | undefined;
  selectableAddresses: Address[];
  handleAddressChange: (address: Address | null) => void;
  handleAddressAdditionalInformationChange: (
    event: ChangeEvent<HTMLInputElement>
  ) => void;
  control: any;
  errors: any;
}

// react-window
// const LIST_BOX_PADDING = 8;
//
// function renderRow(props: ListChildComponentProps) {
//   const { data, index, style } = props;
//   const dataSet = data[index];
//   const inlineStyle = {
//     ...style,
//     top: (style.top as number) + LIST_BOX_PADDING,
//     // padding: 8,
//   };
//
//   return (
//     <Typography component="li" noWrap style={inlineStyle}>
//       {dataSet.key}
//     </Typography>
//   );
// }
//
// const OuterElementContext = createContext({});
//
// const OuterElementType = forwardRef<HTMLDivElement>((props, ref) => {
//   const outerProps = useContext(OuterElementContext);
//   return <div ref={ref} {...props} {...outerProps} />;
// });
// function useResetCache(data: any) {
//   // Direct reference to the dom element
//   const ref = useRef<VariableSizeList>(null);
//   useEffect(() => {
//     if (ref.current != null) {
//       ref.current.resetAfterIndex(0, true);
//     }
//   }, [data]);
//   return ref;
// }
// Adapter for react-window
// const ListboxComponent = forwardRef<
//   HTMLDivElement,
//   HTMLAttributes<HTMLElement>
//   >(function ListboxComponent(props, ref) {
//   const { children, ...other } = props;
//   const itemData: ReactChild[] = [];
//   (children as ReactChild[]).forEach(
//     (item: ReactChild & { children?: ReactChild[] }) => {
//       itemData.push(item);
//       itemData.push(...(item.children || []));
//     },
//   );
//
//   const theme = useTheme();
//   const smUp = useMediaQuery(theme.breakpoints.up('sm'), {
//     noSsr: true,
//   });
//   const itemCount = itemData.length;
//   const itemSize = smUp ? 36 : 48;
//   // const itemSize = 36;
//
//   const getChildSize = () => {
//     return itemSize;
//   };
//   //
//   const getHeight = () => {
//     console.log("itemCount", itemCount);
//     if (itemCount > 1) {
//       return 8 * itemSize;
//     }
//     return itemData.map(getChildSize).reduce((a, b) => a + b, 0);
//   };
//
//   const gridRef = useResetCache(itemCount);
//
//   return (
//     <div ref={ref}>
//       <OuterElementContext.Provider value={other}>
//         <VariableSizeList
//           itemData={itemData}
//           // height={getHeight() + 2 * LIST_BOX_PADDING}
//           height={getHeight() * 2 * LIST_BOX_PADDING}
//           width="100%"
//           ref={gridRef}
//           outerElementType={OuterElementType}
//           innerElementType="ul"
//           itemSize={() => getChildSize()}
//           overscanCount={5}
//           itemCount={itemCount}
//         >
//           {renderRow}
//         </VariableSizeList>
//       </OuterElementContext.Provider>
//     </div>
//   );
// });
// const StyledPopper = styled(Popper)({
//   [`& .${autocompleteClasses.listbox}`]: {
//     boxSizing: 'border-box',
//     '& ul': {
//       padding: 0,
//       margin: 0,
//     },
//   },
// });

const SelectAddressFormController = ({
  addressType,
  currentAddress,
  selectableAddresses,
  handleAddressChange,
  handleAddressAdditionalInformationChange,
  control,
  errors
}: AddressSelectProps) => {
  const fieldName = addressType.toString();
  const labelName =
    fieldName.charAt(0).toUpperCase() + fieldName.slice(1) + " Address";

  const handleAddressValueChange = (event, newValue) => {
    let selectedAddress = newValue as Address | null;
    handleAddressChange(selectedAddress);
    errors[fieldName] = "";
  };

  const addressOptionLabel = (address: Address) => {
    return (
      address?.street1 +
      (address?.street2 ? " , " + address?.street2 : "") +
      ", " +
      address?.zip +
      ", " +
      address?.city +
      ", " +
      address?.country
    );
  };

  return (
    <Box sx={{ height: "34vh" }}>
      <Grid item xs={12} sm={12} mb={7}>
        <FormControl fullWidth>
          <Controller
            name={fieldName}
            control={control}
            rules={{ required: true }}
            render={({ field: { value, onChange } }) => (
              <Autocomplete
                options={selectableAddresses}
                value={currentAddress?.street1 ? currentAddress : null}
                noOptionsText="No addresses found"
                // PopperComponent={StyledPopper}
                // ListboxComponent={ListboxComponent}
                getOptionLabel={(address) => addressOptionLabel(address)}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                onChange={handleAddressValueChange}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    value={value}
                    label={labelName}
                    variant="standard"
                    placeholder={"Search by address..."}
                  />
                )}
              />
            )}
          />
        </FormControl>
        {errors[fieldName] && (
          <FormHelperText sx={{ color: "error.main", position: "absolute" }}>
            {errors[fieldName].message}
          </FormHelperText>
        )}
      </Grid>
      <Grid container spacing={2}>
        <Grid item xs={12} mb={2}>
          <Typography variant="body2">
            {fieldName === "source" ? "Sender" : "Receiver"} Information
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Controller
            name="name"
            control={control}
            render={({ field: { value, onChange } }) => (
              <TextField
                fullWidth
                name="name"
                value={currentAddress?.name ? currentAddress.name : ""}
                onChange={handleAddressAdditionalInformationChange}
                label="Name"
                error={Boolean(errors.name)}
              />
            )}
          />
          {errors.name && (
            <FormHelperText sx={{ color: "error.main" }}>
              {errors.name.message}
            </FormHelperText>
          )}
        </Grid>
        <Grid item xs={12} sm={6}>
          <Controller
            name="company"
            control={control}
            render={({ field: { value, onChange } }) => (
              <TextField
                fullWidth
                name="company"
                value={currentAddress?.company ? currentAddress.company : ""}
                onChange={handleAddressAdditionalInformationChange}
                label="Company"
                error={Boolean(errors.company)}
              />
            )}
          />
          {errors.company && (
            <FormHelperText sx={{ color: "error.main" }}>
              {errors.company.message}
            </FormHelperText>
          )}
        </Grid>
        <Grid item xs={12} sm={6}>
          <Controller
            name="phone"
            control={control}
            render={({ field: { value, onChange } }) => (
              <TextField
                fullWidth
                name="phone"
                value={currentAddress?.phone ? currentAddress.phone : ""}
                onChange={handleAddressAdditionalInformationChange}
                label="Phone"
                error={Boolean(errors.phone)}
              />
            )}
          />
          {errors.phone && (
            <FormHelperText sx={{ color: "error.main" }}>
              {errors.phone.message}
            </FormHelperText>
          )}
        </Grid>
        <Grid item xs={12} sm={6}>
          <Controller
            name="email"
            control={control}
            render={({ field: { value, onChange } }) => (
              <TextField
                fullWidth
                name="email"
                value={currentAddress?.email ? currentAddress.email : ""}
                onChange={handleAddressAdditionalInformationChange}
                label="Email"
                error={Boolean(errors.email)}
              />
            )}
          />
          {errors.email && (
            <FormHelperText sx={{ color: "error.main" }}>
              {errors.email.message}
            </FormHelperText>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default SelectAddressFormController;
