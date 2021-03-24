import { React, useState } from "react";
import { useForm } from "react-hook-form";
import { Redirect } from "react-router-dom";
import { Link } from "react-router-dom";
import { object, string, date } from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import { parseDateString } from "../../helpers/DateValidations.js";
import { Alert, AlertTitle } from "@material-ui/lab";
import Collapse from "@material-ui/core/Collapse";
import moment from "moment";

import Layout from "../../components/Layout";
import "./style.sass";

const useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    flexWrap: "wrap",
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 200,
  },
}));

const NewBarbecue = (props) => {
  const [API] = useState(process.env.REACT_APP_API_ADDRESS);
  const [redirect, setRedirect] = useState(false);

  const [open, setOpen] = useState(false);

  const classes = useStyles();

  const initialState = {
    title: "",
    description: "",
    observation: "",
    date: moment().format("YYYY-MM-DD"),
  };

  const schema = object().shape({
    title: string().required("O evento é obrigatório!"),
    description: string(),
    observation: string(),
    date: date()
      .transform(parseDateString)
      .required("A data é obrigatória!")
      .nullable(true)
      .default(undefined),
    contributionWithBear: string().required(
      "O Valor por participante com bebida é obrigatório!"
    ),
    contributionWithoutBear: string().required(
      "O Valor por participante sem bebida é obrigatório!"
    ),
  });

  const { register, handleSubmit, errors } = useForm({
    mode: "onSubmit",
    defaultValues: initialState,
    reValidateMode: "onChange",
    resolver: yupResolver(schema),
    criteriaMode: "firstError",
    shouldFocusError: true,
    shouldUnregister: true,
  });

  const onSubmit = async (input, e) => {
    const responseBarbecues = await fetch(`${API}/barbecues`);
    const barbecues = await responseBarbecues.json();

    const response = await fetch(`${API}/barbecues`, {
      method: "POST",
      body: JSON.stringify({
        id: barbecues.map((x) => x.id)[barbecues.length - 1].id + 1,
        participants: [],
        ...input,
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    });

    const result = await response.json();

    if (result.id) {
      setOpen(true);
      setRedirect(true);
    }

    e.target.reset();
  };

  const onError = (errors, e) => {
    console.log(errors, e);
  };

  return redirect ? (
    <Redirect to="/churrascos" />
  ) : (
    <Layout>
      <main>
        <Link to="/churrascos/">
          <button className="back-page">↩ voltar</button>
        </Link>
        <div className="form-box">
          <form onSubmit={handleSubmit(onSubmit, onError)}>
            <div className="form-group">
              <label htmlFor="title">
                Evento:
                <input type="text" id="title" name="title" ref={register} />
              </label>
              {errors.title && (
                <p className="error">{errors.title.message || "Requerido"}</p>
              )}
            </div>
            <div className="form-group">
              <label htmlFor="description">Descrição</label>
              <textarea
                id="description"
                name="description"
                rows="4"
                cols="50"
                placeholder="Mensagem"
                ref={register}
              ></textarea>
            </div>
            <div className="form-group">
              <label htmlFor="observation">Observação</label>
              <textarea
                id="observation"
                name="observation"
                rows="4"
                cols="50"
                placeholder="Mensagem"
                ref={register}
              ></textarea>
            </div>
            <div className="form-row-flex">
              <div className="form-group">
                <label htmlFor="date">Data</label>
                <TextField
                  id="date"
                  name="date"
                  type="date"
                  className={classes.textField}
                  error={!!errors.date}
                  inputRef={register}
                />
                {errors.date && (
                  <p className="error">{errors.date.message || "Requerido"}</p>
                )}
              </div>
              <div className="form-group form-group-people">
                <label htmlFor="contributionWithBear">
                  Valor Participante Com Bebida:
                </label>
                <input
                  type="text"
                  id="contributionWithBear"
                  name="contributionWithBear"
                  ref={register}
                  placeholder="ex:20,00"
                />
                {errors.contributionWithBear && (
                  <p className="error">
                    {errors.contributionWithBear.message || "Requerido"}
                  </p>
                )}
              </div>
              <div className="form-group form-group-people">
                <label htmlFor="contributionWithoutBear">
                  Valor Participante Sem Bebida:
                </label>
                <input
                  type="text"
                  id="contributionWithoutBear"
                  name="contributionWithoutBear"
                  ref={register}
                  placeholder="ex:10,00"
                />
                {errors.contributionWithoutBear && (
                  <p className="error">
                    {errors.contributionWithoutBear.message || "Requerido"}
                  </p>
                )}
              </div>
            </div>
            <div className="form-group form-group-submit">
              <Link to="/churrascos/">
                <button type="button" className="btn-default btn-cancel">
                  Cancelar
                </button>
              </Link>
              <button type="submit" className="btn-default">
                Salvar
              </button>
            </div>
          </form>
        </div>
        <Collapse in={open}>
          <Alert severity="success">
            <AlertTitle>Sucesso!</AlertTitle>
            Churrasco cadastrado.
          </Alert>
        </Collapse>
      </main>
    </Layout>
  );
};

export default NewBarbecue;
