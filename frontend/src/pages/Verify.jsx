import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function Verify() {
    const [params] = useSearchParams();
    const navigate = useNavigate();

    useEffect(() => {
        async function verifyEmail() {
            const token = params.get("token");

            if(!token){
            alert("Invalid Verification Link");
            return;
            }
            try{
                const res = await fetch(`http://localhost:8000/api/auth/verify?token=${token}`);
                const data = await res.json();

                if(!res.ok){
                    alert(data.detail || "Verification Failed");
                    return;
                }
                alert(data.message)
                navigate("/auth");
            } catch(err) {
                console.error(err);
                alert("Verification Failed");
            }
        }
        verifyEmail();
    }, );

    return (
        <div className="min-h-screen flex items-center justify-center">
            <p className="text-lg font-medium">Verifying your Acoount...</p>
        </div>
    );
}