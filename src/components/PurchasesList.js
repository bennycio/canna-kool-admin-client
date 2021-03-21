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

  const authShipping = () => {
    if (
      window.confirm(
        "Are you sure you want to send off " +
          selectedIds.length +
          " purchases for shipment?"
      )
    ) {
      fetch(process.env.REACT_APP_API_URL + "/isauth")
        .then((response) => response.json())
        .then((json) => {
          var value = json.isAuth;
          if (value) {
            data.forEach((it) => {
              console.log(it);
              fetch(process.env.REACT_APP_API_URL + "/createitem", {
                method: "POST",
                body: JSON.stringify({
                  PaymentType: "Cash",
                  AccountRef: {
                    value: "42",
                  },
                  Line: [
                    {
                      DetailType: "AccountBasedExpenseLineDetail",
                      Amount: 10.0,
                      AccountBasedExpenseLineDetail: {
                        AccountRef: {
                          name: "Canna-Kool",
                          value: "42",
                        },
                      },
                      Description: it.Address,
                    },
                  ],
                }),
              });
            });
          } else {
            fetch(process.env.REACT_APP_API_URL + "/qbauth")
              .then((response) => response.json())
              .then((json) => {
                setRedirect(json.url);
                setRedirect(null);
              });
          }
        });
    }
  };

  return (
    <TopToolbar>
      <Button onClick={() => authShipping()} label="Authorize Shipment">
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
