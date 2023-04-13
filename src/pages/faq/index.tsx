import { Fragment, useEffect, useState, SyntheticEvent } from "react";

import { GetStaticProps, InferGetStaticPropsType } from "next/types";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import Icon from "src/@core/components/icon";

import axios from "axios";

import FaqHeader from "src/views/pages/faq/FaqHeader";
import FaqFooter from "src/views/pages/faq/FaqFooter";

export type FaqType = {
  id: string;
  icon: string;
  title: string;
  subtitle: string;
  QA: QA[];
};

interface QA {
  id: string;
  answer: string;
  question: string;
}

const FAQ = ({ apiData }: InferGetStaticPropsType<typeof getStaticProps>) => {
  const [data, setData] = useState<{ faqData: FaqType } | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [activeTab, setActiveTab] = useState<string>("payment");

  useEffect(() => {
    if (searchTerm !== "") {
      axios
        .get("/pages/faqs", { params: { q: searchTerm } })
        .then((response) => {
          if (
            response.data.faqData &&
            Object.values(response.data.faqData).length
          ) {
            setData(response.data);

            // @ts-ignore
            setActiveTab(Object.values(response.data.faqData)[0].id);
          } else {
            setData(null);
          }
        });
    } else {
      setData(apiData);
    }
  }, [apiData, searchTerm]);

  const handleChange = (event: SyntheticEvent, newValue: string) => {
    setActiveTab(newValue);
  };

  const renderNoResult = (
    <Box
      sx={{
        mt: 8,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        "& svg": { mr: 2 }
      }}
    >
      <Icon icon="mdi:alert-circle-outline" />
      <Typography variant="h6">No Results Found!!</Typography>
    </Box>
  );

  return (
    <Fragment>
      <FaqHeader searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      {/*{data !== null ? <FAQS data={data} activeTab={activeTab} handleChange={handleChange} /> : renderNoResult}*/}
      <FaqFooter />
    </Fragment>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  // const res = await axios.get("/pages/faqs");
  const apiData: FaqType[] = [
    {
      id: "1",
      icon: "",
      title: "",
      subtitle: "",
      QA: [
        {
          id: "1",
          question: "Do u like u",
          answer: "no"
        }
      ]
    }
  ];

  return {
    props: {
      apiData
    }
  };
};

export default FAQ;
