import type { FC } from "react";
import { Outlet } from "react-router-dom";

const PublicLayout: FC = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-accent/5">
            <Outlet />
        </div>
    );
};

export default PublicLayout;

