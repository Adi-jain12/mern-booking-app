import { useForm } from "react-hook-form";

type RegisterFormData = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
};

const Register = () => {
  const { register } = useForm<RegisterFormData>();

  return (
    <form className="flex flex-col gap-4">
      <h2 className="text-3xl font-bold">Create an Account</h2>
    </form>
  );
};

export default Register;
