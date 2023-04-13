import { useLoadScript } from "@react-google-maps/api";
import usePlacesAutocomplete, { getDetails } from "use-places-autocomplete";
import React, { ChangeEvent, useState } from "react";
import { Autocomplete, Box, TextField } from "@mui/material";
import { AddressDetails } from "../addresses/addressForm";
import PlaceResult = google.maps.places.PlaceResult;
import { useSettings } from "../../@core/hooks/useSettings";

type Libraries = (
  | "drawing"
  | "geometry"
  | "localContext"
  | "places"
  | "visualization"
)[];
const places: Libraries = ["places"];

const AddressAutoCompleteField = ({
  addressDetails,
  setAddressDetails,
  handleAddressValueChange,
  error,
  addressToEdit // When we edit an address, this object will be defined
}) => {
  const [value, setValue] = useState<string>("");
  // To detect if street1 has changed
  const [valueHasChanged, setValueHasChanged] = useState<boolean>(false);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "",
    libraries: places
  });

  const street = () => {
    return !valueHasChanged ? addressToEdit?.street1 : value;
  };

  if (loadError || addressToEdit) {
    // If the google api won't work for some reason, load the field without any auto complete feature
    // Or if the addressToEdit is defined (we are in an editing modal) and in edit mode, the auto complete search is disabled
    return (
      <TextField
        fullWidth
        name="street1"
        label="Enter an address"
        onChange={(e) => {
          if (!valueHasChanged) {
            setValueHasChanged(true);
          }
          setValue(e.target.value);
          handleAddressValueChange(e);
        }}
        error={error}
        value={street()}
      />
    );
  }

  if (!isLoaded) return <div>Loading...</div>;

  return (
    <PlacesAutoCompleteComboBox
      addressDetails={addressDetails}
      setAddressDetails={setAddressDetails}
      handleAddressValueChange={handleAddressValueChange}
      error={error}
      street1Value={addressToEdit?.street1}
    />
  );
};

const PlacesAutoCompleteComboBox = ({
  addressDetails,
  setAddressDetails,
  handleAddressValueChange,
  error,
  street1Value
}) => {
  const { settings } = useSettings();

  const {
    ready,
    value,
    setValue,
    suggestions: { status, data },
    clearSuggestions
  } = usePlacesAutocomplete({
    requestOptions: {
      // Define your options object with the countries in the desired order
      componentRestrictions: { country: ["us", "ca"] }
    }
  });

  const populateAddressFields = async (option) => {
    if (!option) {
      setAddressDetails({
        street1: "",
        city: "",
        country: "",
        zip: "",
        state: ""
      });
      return;
    }
    setValue(option.structured_formatting.main_text, false);
    clearSuggestions();

    const details = (await getDetails({
      placeId: option.place_id
    })) as PlaceResult;

    if (details.address_components) {
      const addressDetailsObj = Object.assign(
        {},
        ...details.address_components.map((item) => ({
          [item.types[0]]: item.long_name
        }))
      );

      const streetNumber = addressDetailsObj?.street_number;
      const route = addressDetailsObj?.route;

      let street1;
      if (!streetNumber && !route) {
        street1 = addressDetailsObj?.neighborhood;
      } else {
        street1 = `${streetNumber} ${route}`;
      }

      const newAddressDetails: AddressDetails = {
        street1,
        city: addressDetailsObj.locality ?? "",
        country: addressDetailsObj.country ?? "",
        zip: addressDetailsObj.postal_code ?? "",
        state: addressDetailsObj.administrative_area_level_1 ?? "",
        street2: addressDetails.street2 ?? ""
      };

      setAddressDetails(newAddressDetails);
    }
  };

  const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    handleAddressValueChange(e);
  };

  const street1 = (value) => {
    return (!value ? street1Value : value) || null;
  };

  return (
    <Autocomplete
      freeSolo
      id="places-combo-box-autocomplete"
      disabled={!ready}
      options={data}
      onChange={(e, option) => populateAddressFields(option)}
      value={street1(value)}
      getOptionLabel={(option) =>
        typeof option === "string" ? option : option.description
      }
      renderInput={(params) => (
        <TextField
          {...params}
          fullWidth
          name="street1"
          label="Enter an address"
          variant="outlined"
          onChange={handleOnChange}
          placeholder="Search..."
          error={error}
        />
      )}
      renderOption={(props, option) => {
        const isLastOption = data.indexOf(option) === data.length - 1;
        const optionElement = (
          <Box
            component="li"
            {...props}
            key={option.place_id}
            onClick={() => populateAddressFields(option)}
          >
            {option.description}
          </Box>
        );

        if (isLastOption) {
          const googleLogoElement = (
            <Box
              component="li"
              key="google-logo"
              p={2}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
                marginRight: "6px"
              }}
            >
              <img
                src={
                  settings.mode == "light"
                    ? "/images/misc/google-logo.png"
                    : "/images/misc/google-logo-white.png"
                }
                alt="Google"
                style={{
                  marginLeft: "4px",
                  width: "60px",
                  height: "auto"
                }}
              />
            </Box>
          );
          return [optionElement, googleLogoElement];
        }

        return optionElement;
      }}
    />
  );
};

export default AddressAutoCompleteField;
