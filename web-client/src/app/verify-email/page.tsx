"use client";

import React, { useEffect, useLayoutEffect } from "react";

import EmailVerification from "@/components/emailVerification";

import { useSendVerifyEmail } from "@/hooks/sendEmail/useSendVerifyEmail";
import { useAppRouter } from "@/contexts/navigation.context";

import { useUser } from "@/hooks/useUser";
import Loader from "@/components/loader/loader";
import TransitionWrapper from "@/components/transitionWrapper";
import { useLogout } from "@/hooks/useLogout";

export default function VerifyEmail() {
  const { startTransition, push } = useAppRouter();

  const { isSuccess, isPending, error, mutateAsync, mutate } =
    useSendVerifyEmail();

  const message = error?.response?.data.message || null;

  const {
    data: user,
    isLoading,
    isPending: userIsPending,
    isSuccess: userIsSuccess,
  } = useUser();
  const { mutateAsync: logout } = useLogout();

  const returnToLogin = async () => {
    startTransition(async () => {
      await logout();
    });
  };

  const sendMail = async () => {
    if (user?.email) {
      startTransition(async () => {
        await mutateAsync({ email: user.email });
      });
    }
  };

  if (isLoading || userIsPending) return <Loader showLogo={false} />;

  useEffect(() => {
    if (userIsSuccess) mutate({ email: user.email });
  }, [userIsSuccess]);

  const title = (
    <h1 className="title">Verifique o seu email continuar usando sua conta.</h1>
  );

  const description = (
    <p className="paragraph">
      Clique no botão abaixo para enviar um link de verificação para{" "}
      <b>{user?.email || ""}</b>
    </p>
  );

  useLayoutEffect(() => {
    if (user && user.emailVerified) push("/dashboard");
  }, [user]);

  return (
    <TransitionWrapper motionKey="verify-email">
      <EmailVerification
        title={title}
        description={description}
        sendedTitle="Email enviado com sucesso."
        sendedDescription="Clique no link enviado no seu email para liberar todas as funcionalidades da sua conta."
        onSend={sendMail}
        sendLabel={"Clique para enviar link no email"}
        back={returnToLogin}
        backLabel="Fazer login em outra conta"
        message={message}
        isLoading={isPending}
        isSuccess={isSuccess}
        locked={true}
      />
    </TransitionWrapper>
  );

  // let disabled = isPending || timeLeft > 0;

  // const getMessage = () => {
  //   // if (isSuccess) {
  //   //   return <div className={styles.successMessage}>{data.message}</div>;
  //   // }

  //   let msg = "Erro interno.";

  //   if (isError) {
  //     if (
  //       (error.response?.data.status === "UserError" ||
  //         error.response?.data.status === "AuthError") &&
  //       !sended &&
  //       !wait
  //     ) {
  //       msg = error.response?.data.message;
  //       return <div className={styles.errorMessage}>{msg}</div>;
  //     }
  //   }

  //   return null;
  // };

  // useLayoutEffect(() => {
  //   if (wait && !sended) {
  //     router.push("/verify-email/wait");
  //   }
  //   if (sended && !wait) {
  //     router.push("/verify-email/sended");
  //   }
  //   if (user) {
  //     if (user.emailVerified) {
  //       router.push("/dashboard");
  //       return;
  //     }

  //     setEmail(user.email);
  //     mutate({ email: user.email });
  //   }
  // }, [router, sended, wait]);

  // return (
  //   <TransitionWrapper>
  //     <div className={styles.form}>
  //       <div className={styles.header}>
  //         <h1 className={styles.title}>Verifique o seu email</h1>
  //         <p className={styles.paragraph}>
  //           Para continuar utilizando todas as funções do Lux CRM será
  //           necessário verificar o seu email.
  //         </p>
  //       </div>
  //       <div className={styles.inputs}>
  //         <Input
  //           disabled={true}
  //           placeholder="Digite seu email."
  //           type="email"
  //           name="email"
  //           value={email}
  //           label="Email"
  //           onChange={(e) => setEmail(e.target.value)}
  //         />
  //         {getMessage()}
  //       </div>
  //       <div className="buttons">
  //         <Button
  //           disabled={disabled}
  //           type="button"
  //           onClick={sendEmail}
  //           background={disabled ? "transparent" : "gradient"}
  //           className="submit"
  //         >
  //           {isPending || timeLeft > 0
  //             ? "Enviando email..."
  //             : "Enviar Link no Email"}
  //         </Button>
  //         <Button
  //           onClick={() => {
  //             endSession();
  //             router.push("/login");
  //           }}
  //           className="back"
  //           background={"transparent"}
  //           type="button"
  //         >
  //           Entrar com outra conta
  //         </Button>
  //       </div>
  //     </div>
  //   </TransitionWrapper>
  // );
}
