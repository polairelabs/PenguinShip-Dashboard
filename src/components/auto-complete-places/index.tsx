import { useLoadScript } from "@react-google-maps/api";
import usePlacesAutocomplete, { getDetails } from "use-places-autocomplete";
import React from "react";
import { TextField, Box, Autocomplete } from "@mui/material";
import PlaceResult = google.maps.places.PlaceResult;
import { AddressDetails } from "../../types/components/addressDetailsType";
type Libraries = ("drawing" | "geometry" | "localContext" | "places" | "visualization")[];
const places : Libraries = ["places"] ;

export default function PlacesAutoComplete(props) {
  const { setAddressDetails } = props;
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "",
    libraries: places
  });

  if (!isLoaded) return <div>Loading...</div>;
  return <PlacesAutoCompleteComboBox setAddressDetails={setAddressDetails} />;
}

const PlacesAutoCompleteComboBox = (props) => {
  const { setAddressDetails } = props;
  const {
    ready,
    value,
    setValue,
    suggestions: { status, data },
    clearSuggestions
  } = usePlacesAutocomplete();

  const handleOnChange = (e) => {
    setValue(e.target.value);
  };

  const handleSelect = async (option) => {
    setValue(option.description, false);
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
        city: addressDetailsObj.locality,
        country: addressDetailsObj.country,
        postalCode: addressDetailsObj.postal_code,
        region: addressDetailsObj.administrative_area_level_1,
        street1: option.description
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
          required
          label="Enter an address"
          variant="outlined"
          onChange={handleOnChange}
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
