import phrasePanelBg from "../../assets/phrase-panel-bg.svg";
import '../../styles/dealer-notes.css';

export default function DealerNote({ title = "Dealer Note", icon = "🎯", children }: { title: string; icon?: string; children: React.ReactNode }) {
    return (
        <section className="dealer-note" style={{ backgroundImage: `url(${phrasePanelBg})` }}>
            <div className="note-header">
                <span className="icon">{icon}</span>
                <h3>{title}</h3>
            </div>
            <div className="note-body">
                {children}
            </div>
        </section>
    )
}
