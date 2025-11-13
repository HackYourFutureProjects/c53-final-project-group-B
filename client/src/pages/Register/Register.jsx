import RegisterForm from "../../components/RegisterForm.jsx";

const Register = () => {
  return (
    <>
      <RegisterForm />
      <main
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "calc(20vh - 80px)",
          backgroundColor: "var(--color-bg-light)",
          padding: "1rem",
        }}
      ></main>
    </>
  );
};

export default Register;
