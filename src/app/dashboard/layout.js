import AuthComponent from "../components/AuthComponent";

export default function DashboardLayout({ children, chatty }) {
    return <section>
                <AuthComponent>
                {chatty}
                {children}
                </AuthComponent>
            </section>
  }
