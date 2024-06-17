import { getServerSession } from "next-auth";
import { SendCard } from "../../../components/SendCard";
import { authOptions } from "../../lib/auth";
import prisma from "@repo/db/client";
import { P2pTranscations } from "../../../components/P2pTranscations";

async function getP2ptranscations() {
    const session = await getServerSession(authOptions);
    const txns = await prisma.p2pTransfer.findMany({
        where: {
            fromUserId: Number(session?.user?.id)
        }
    });
    return txns.map(t => ({
        time: t.timestamp,
        amount: t.amount,
        toUserId: t.toUserId
    }))
}

export default async function () {
    const transactions = await getP2ptranscations();

    return <div className="w-screen">
        <div className="text-4xl text-[#6a51a6] pt-8 mb-8 font-bold">
            P2P Transfer
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 mr-2">
            <div>
                <SendCard />
            </div>
            <div>
                <P2pTranscations transactions={transactions} />
            </div>
        </div>
    </div>
}