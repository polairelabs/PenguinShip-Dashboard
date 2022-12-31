import { useLoadScript } from "@react-google-maps/api";
import usePlacesAutocomplete, { getDetails } from "use-places-autocomplete";
import React, { ChangeEvent } from "react";
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
  setAddressDetails,
  handleAddressValueChange,
  error
}) {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "",
    libraries: places
  });

  if (loadError) {
    // If the google api won't work for some reason, load the field without any auto complete feature
    return (
      <TextField
        fullWidth
        name="street1"
        label="Enter an addresses"
        onChange={handleAddressValueChange}
        error={error}
      />
    );
  }

  if (!isLoaded) return <div>Loading...</div>;

  return (
    <PlacesAutoCompleteComboBox
      setAddressDetails={setAddressDetails}
      handleAddressValueChange={handleAddressValueChange}
      error={error}
    />
  );
}

const PlacesAutoCompleteComboBox = ({
  setAddressDetails,
  handleAddressValueChange,
  error
}) => {
  const {
    ready,
    value,
    setValue,
    suggestions: { status, data },
    clearSuggestions
  } = usePlacesAutocomplete();

  const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    handleAddressValueChange(e);
  };

  const handleSelect = async (option) => {
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

      const addressDetails: AddressDetails = {
        street1:
          addressDetailsObj.street_number + " " + addressDetailsObj.route,
        city: addressDetailsObj.locality,
        country: addressDetailsObj.country,
        zip: addressDetailsObj.postal_code,
        state: addressDetailsObj.administrative_area_level_1
      };

      setAddressDetails(addressDetails);
    }
  };

  return (
    <Autocomplete
      freeSolo
      id="places-combo-box-autocomplete"
      disabled={!ready}
      options={data}
      value={value}
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
          error={error}
        />
      )}
      renderOption={(props, option) => (
        <Box
          component="li"
          {...props}
          key={option.place_id}
          onClick={() => handleSelect(option)}
        >
          {option.description}
        </Box>
      )}
    />
  );
};
