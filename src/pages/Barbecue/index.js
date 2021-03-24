import { React, useState, useEffect, createRef } from "react";
import { Link, useParams } from "react-router-dom";
import MaterialTable, { MTableToolbar } from "material-table";
import Dialog from "../../components/Dialog";
import Checkbox from "@material-ui/core/Checkbox";

import Layout from "../../components/Layout";
import "./style.sass";

const Barbecue = (props) => {
  const [API] = useState(process.env.REACT_APP_API_ADDRESS);
  const { id } = useParams();
  const tableRef = createRef();
  const [key, setKey] = useState(Math.random());
  const [barbecue, setBarbecue] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    (async () => {
      if (!barbecue) {
        loadBarbecue();
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [barbecue, participants]);

  const loadBarbecue = async () => {
    const response = await fetch(`${API}/barbecues/${id}`);
    const data = await response.json();
    setBarbecue(data);
    setParticipants(data.participants);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChangeCheckbox = async (e, id) => {
    let data = participants;
    const index = participants.findIndex((x) => x.id === id);
    data[index].status = e.target.checked;

    setParticipants(data);

    const result = await updateBarbecue({ participants: data });

    if (result) setKey(Math.random());
  };

  const updateBarbecue = async (data) => {
    const response = await fetch(`${API}/barbecues/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    });

    const result = await response.json();
    return !!result.id;
  };

  const componentsSettings = {
    Toolbar: (props) => {
      const total = props.data.reduce(
        (prev, cur) => prev + parseFloat(cur.contribution.replace(/,/g, ".")),
        0
      );

      return (
        <div>
          <MTableToolbar {...props} />
          <div className="info-flex">
            <p className="people">{props.data.length}</p>
            <p className="money">{total.toLocaleString()}</p>
          </div>
          <div className="info-flex">
            <p className="money-bear">
              {barbecue ? `R$ ${barbecue.contributionWithBear} com bebida` : ""}
            </p>
            <p className="money-nobear">
              {barbecue
                ? `R$ ${barbecue.contributionWithoutBear} sem bebida`
                : ""}
            </p>
          </div>
        </div>
      );
    },
  };

  return (
    <Layout>
      <main>
        <Link to="/churrascos/">
          <button className="back-page">↩ voltar</button>
        </Link>
        <div className="container-detail">
          <MaterialTable
            key={key}
            title={barbecue ? `${barbecue.title}` : ""}
            columns={[
              {
                title: "",
                field: "id",
                hidden: true,
              },
              {
                title: "",
                field: "status",
                render: (rowData) => (
                  <Checkbox
                    checked={rowData.status}
                    onChange={(e) => {
                      handleChangeCheckbox(e, rowData.id);
                    }}
                  />
                ),
                editable: "onUpdate",
              },
              {
                title: "Participante",
                field: "fullname",
                // validate: rowData => Boolean(rowData.fullname) ? true : { isValid: true, helperText: 'O nome do participante é obrigatório' }
              },
              {
                title: "Valor",
                field: "contribution",
                // validate: rowData => Boolean(rowData.contribution) ? true : { isValid: true, helperText: 'O valor de contribuição é obrigatório' },
                render: (rowData) => (
                  <div className="teste">
                    <p
                      className={`money-people ${rowData.status ? "paid" : ""}`}
                    >
                      <span>R$</span>
                      {rowData.contribution}
                    </p>
                  </div>
                ),
              },
            ]}
            data={participants}
            editable={{
              isEditHidden: (rowData) => rowData.name === "status",
              onRowAdd: (newData) =>
                new Promise(async (resolve, reject) => {
                  if (newData.fullname && newData.contribution) {
                    let register = [
                      ...participants,
                      {
                        id:
                          participants.length > 0
                            ? participants.map((x) => x.id)[
                                participants.length - 1
                              ] + 1
                            : 1,
                        ...newData,
                      },
                    ];

                    setParticipants(register);

                    if (await updateBarbecue({ participants: register })) {
                      tableRef.current && tableRef.current.onQueryChange();

                      resolve();
                    } else {
                      reject();

                      setTitle("Erro");
                      setDescription(
                        "Houve um erro inesperado ao tentar salvar o registro, tente novamente mais tarde!"
                      );
                      setOpen(true);
                    }
                  } else {
                    reject();

                    setTitle("Validação");
                    setDescription(
                      "É necessário preencher os campos para salvar o registro!"
                    );
                    setOpen(true);
                  }
                }),
              onRowDelete: (oldData) =>
                new Promise(async (resolve, reject) => {
                  // eslint-disable-next-line
                  let register = participants.map((x) => { if (x.id !== oldData.id) return x; }).filter((x) => !!x);

                  setParticipants(register);

                  if (await updateBarbecue({ participants: register })) {
                    tableRef.current && tableRef.current.onQueryChange();

                    resolve();
                  } else {
                    reject();

                    setTitle("Erro");
                    setDescription(
                      "Houve um erro inesperado ao tentar deletar o registro, tente novamente mais tarde!"
                    );
                    setOpen(true);
                  }
                }),
            }}
            options={{
              actionsColumnIndex: -1,
            }}
            components={componentsSettings}
            localization={{
              body: {
                emptyDataSourceMessage: "Nenhum participante encontrado",
                addTooltip: "Adicionar Participante",
                editRow: {
                  deleteText: "Confirma a exclusão do participante?",
                },
              },
              toolbar: {
                searchTooltip: "Buscar Participante",
              },
            }}
          />
          <Dialog
            title={title}
            description={description}
            open={open}
            handleClose={handleClose}
          />
        </div>
      </main>
    </Layout>
  );
};

export default Barbecue;
