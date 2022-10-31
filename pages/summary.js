import { Box, Card, Container, Grid, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import clientPromise from "../lib/mongodb";
import CardDataSummary from "../src/components/CardDataSummary/CardDataSummary";
import { PieChart } from "../src/components/PieChart/PieChart";

const amountPeople = 100;

export default function Summary({ isConnected }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userDataDrinks, setUserDataDrinks] = useState([]);


  useEffect(() => {
    setLoading(true);

    async function getData() {
      const response = await fetch("/api/get-data");
      const responseData = await response.json();
      const all = responseData.all;
      setData(all);
      setLoading(false);
    }

    getData();
  }, []);

  console.log("data featch", data);

  // How many people is coming
  const confirmedPeople = data.filter((person) => {
    return person.isComing === "Yes";
  });

  // How many people is not coming
  const amountNotComingPeople = data.filter((person) => {
    return person.isComing === "No";
  });

  // waiting for answer
  const amountPendingPeople =
    amountPeople -
    Number(confirmedPeople.length) -
    Number(amountNotComingPeople.length);

  //drinks
  const vodkaAmount = data.filter((person) => {
    return person.isVodka === true;
  });
  const ginAmount = data.filter((person) => {
    return person.isGin === true;
  });
  const whiskyAmount = data.filter((person) => {
    return person.isWhisky === true;
  });
  const beerAmount = data.filter((person) => {
    return person.isBeer === true;
  });
  const isNonAlcoholAmount = data.filter((person) => {
    return person.isNonAlcohol === true;
  });



  useEffect(() => {
    setUserDataDrinks([
      {
        id: 1,
        drink: "Vodka cocktails",
        userGain: vodkaAmount.length,
      },
      {
        id: 2,
        drink: "Gin cocktails",
        userGain: ginAmount.length,
      },
      {
        id: 3,
        drink: "Whisky cocktails",
        userGain: whiskyAmount.length,
      },
      {
        id: 4,
        drink: "Beer",
        userGain: beerAmount.length,
      },
      {
        id: 5,
        drink: "non-alcoholic cocktail",
        userGain: isNonAlcoholAmount.length,
      },
    ]);
  }, [
    vodkaAmount.length,
    ginAmount.length,
    whiskyAmount.length,
    beerAmount.length,
    isNonAlcoholAmount.length,
  ]);

  const userData = {
    labels: userDataDrinks?.map((data) => data?.drink),
    datasets: [
      {
        label: "Users Gained",
        data: userDataDrinks?.map((data) => data?.userGain),
        backgroundColor: [
          "rgba(155, 199, 232, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(155, 206, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(153, 102, 255, 0.2)",
          "rgba(155, 159, 64, 0.2)",
        ],
        borderColor: [
          "rgba(155, 199, 232, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(155, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(155, 159, 64, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  console.log("userDataDrink", userDataDrinks);

  const PeanutsPeopleAllergies = data.filter((person) => {
    return person.isPeanuts === true;
  });
  const EggsPeopleAllergies = data.filter((person) => {
    return person.isEggs === true;
  });
  const NutsPeopleAllergies = data.filter((person) => {
    return person.isNuts === true;
  });

  return (
    <div>
      {loading ? (
        <Typography
          variant="h3"
          sx={{
            mb: 5,
            textAlign: "center",
          }}
        >
          Loading...
        </Typography>
      ) : (
        <Box
          sx={{
            // height: "100vh",
            pt: "5rem",
            pb: "15rem",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Container maxWidth="xl">
            <Typography
              variant="h3"
              sx={{
                mb: 5,
                textAlign: "center",
              }}
            >
              Summary of your guest wedding invitations
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={3}>
                <CardDataSummary
                  title="Confirmed"
                  total={confirmedPeople.length}
                  icon={"akar-icons:people-group"}
                  colorIcon="#20A4F3"
                />
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <CardDataSummary
                  title="Not Coming"
                  total={amountNotComingPeople.length}
                  color="info"
                  icon={"emojione-monotone:no-pedestrians"}
                  colorIcon="#011627"
                />
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <CardDataSummary
                  title="Children"
                  total={5}
                  color="warning"
                  icon={"ic:round-child-care"}
                  colorIcon="#2ec4b6"
                />
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <CardDataSummary
                  title={"Pending"}
                  total={amountPendingPeople}
                  color="error"
                  icon={"ic:baseline-pending-actions"}
                  colorIcon="#FF3366"
                />
              </Grid>
            </Grid>
            <Grid container spacing={3} sx={{ mt: "3rem" }}>
              <Grid item xs={12} sm={6} md={4}>
                <Card
                  sx={{
                    py: 6,
                    boxShadow: "5px",
                    textAlign: "center",
                    backgroundColor: "#FDFDEC",
                  }}
                >
                  <PieChart
                    chartData={userData}
                    vodkaAmount={vodkaAmount.length}
                    ginAmount={ginAmount.length}
                    whiskyAmount={whiskyAmount.length}
                    beerAmount={beerAmount.length}
                    isNonAlcoholAmount={isNonAlcoholAmount.length}
                  />
                </Card>
              </Grid>
            </Grid>
          </Container>
        </Box>
      )}
    </div>
  );
}

export async function getServerSideProps() {
  // Connect with MongoDB
  const client = await clientPromise;

  const isConnected = await client.isConnected();

  return {
    props: { isConnected },
  };
}
