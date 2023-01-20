import { useLoadScript } from "@react-google-maps/api";
import usePlacesAutocomplete, { getDetails } from "use-places-autocomplete";
import React, { ChangeEvent, useEffect, useState } from "react";
import { TextField, Box, Autocomplete } from "@mui/material";
import PlaceResult = google.maps.places.PlaceResult;
import { AddressDetails } from "../addresses/addressForm"; // TODO move this elsewhere
type Libraries = (
  | "drawing"
  | "geometry"
  | "localContext"
  | "places"
  | "visualization"
)[];
const places: Libraries = ["places"];

export default function AddressAutoCompleteField({
  addressDetails,
  setAddressDetails,
  handleAddressValueChange,
  error,
  addressToEdit // When we edit an address, this object will be defined
}) {
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
    // Or if the addressToEdit is defined (we are in an editing modal)
    return (
      <TextField
        fullWidth
        name="street1"
        label="Enter an address"
        onChange={e => {
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
}

const PlacesAutoCompleteComboBox = ({
  addressDetails,
  setAddressDetails,
  handleAddressValueChange,
  error,
  street1Value
}) => {
  const {
    ready,
    value,
    setValue,
    suggestions: { status, data },
    clearSuggestions
  } = usePlacesAutocomplete();

  const populateAddressFields = async (option) => {
    if (!option) {
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
        // add space
        street1 = `${streetNumber} ${route}`;
      }

      const newAddressDetails: AddressDetails = {
        street1,
        city: addressDetailsObj.locality,
        country: addressDetailsObj.country,
        zip: addressDetailsObj.postal_code,
        state: addressDetailsObj.administrative_area_level_1,
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
          helperText="Location data provided by Google"
        />
      )}
      renderOption={(props, option) => (
        <Box
          component="li"
          {...props}
          key={option.place_id}
          onClick={() => populateAddressFields(option)}
        >
          {option.description}
        </Box>
      )}
    />
  );
};
