import React, { useEffect, useState } from "react";
import {
  List,
  Datagrid,
  TextField,
  NumberField,
  DateField,
  useListContext,
  TopToolbar,
  Button,
  useGetMany,
  useRefresh,
} from "react-admin";
import SendIcon from "@material-ui/icons/Send";

const ListActions = () => {
  const [redirect, setRedirect] = useState(null);
  useEffect(() => {
    if (redirect) {
      window.location.href = redirect;
    }
  }, [redirect]);
  const { selectedIds } = useListContext();
  const { data, loading, error } = useGetMany("purchases", selectedIds);
  const refreshPage = useRefresh();

  const authShipping = async () => {
    if (
      window.confirm(
        "Are you sure you want to send off " +
          selectedIds.length +
          " purchases for shipment?"
      )
    ) {
      const url = process.env.REACT_APP_API_URL + "/completePurchase";
      const data = {
        ids: [...selectedIds],
      };
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data), // body data type must match "Content-Type" header
      });
      if (response.ok) alert("success");
      else alert("fail");
    }
  };

  return (
    <TopToolbar>
      <Button onClick={authShipping} label="Authorize Shipment">
        <SendIcon />
      </Button>
    </TopToolbar>
  );
};

export const PurchaseList = (props) => (
  <List {...props} bulkActionButtons={<ListActions />}>
    <Datagrid rowClick="edit">
      <TextField source="id" />
      <DateField source="date" />
      <NumberField source="Price" />
      <TextField source="Address" />
    </Datagrid>
  </List>
);

export default PurchaseList;
