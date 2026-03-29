document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById("equipmentModal");
    const closeBtn = document.querySelector(".close-modal");
    const modalData = document.getElementById("modalData");
    const openButtons = document.querySelectorAll('.open-equip-modal');

    openButtons.forEach(btn => {
        btn.addEventListener('click', async (e) => {
            e.preventDefault();
            const heroKey = btn.getAttribute('data-hero');
            const equipKey = btn.getAttribute('data-equip');

            try {
                // Pfad geht aus dem Unterordner (pages/Hero/) hoch zum Hauptordner zur JSON
                const response = await fetch('../../equipment_data.json'); 
                if (!response.ok) throw new Error("JSON konnte nicht geladen werden");
                const data = await response.json();
                
                const item = data.heroes[heroKey].equipment[equipKey];
                renderTable(item);
                modal.style.display = "block";
            } catch (error) {
                console.error("Fehler:", error);
                alert("Fehler beim Laden der Daten. Bitte prüfe die Konsolenausgabe.");
            }
        });
    });

    function renderTable(item) {
        // Holt das Highlight-Level aus der JSON (z.B. 9)
        const targetLevel = item.highlight_level;

        modalData.innerHTML = `
            <div class="modal-header-info">
                <h2>${item.name}</h2>
                <span class="rarity-tag">${item.rarity}</span>
            </div>
            <table class="equip-table">
                <thead>
                    <tr>
                        ${item.table_headers.map(h => `<th>${h}</th>`).join('')}
                    </tr>
                </thead>
                <tbody>
                    ${item.levels.map(l => {
                        // Prüfen, ob dieses Level hervorgehoben werden soll
                        const isHighlighted = (l.level === targetLevel) ? 'class="row-highlight"' : '';
                        
                        return `
                            <tr ${isHighlighted}>
                                <td>${l.level}</td>
                                <td>${l.summoned || l.damage_increase || '-'}</td>
                                <td>${l.barb_damage_incr || l.speed_increase || '-'}</td>
                                <td>${l.performance_score || '-'}</td>
                                <td>${l.shiny_cost}</td>
                                <td>${l.glowy_cost}</td>
                            </tr>
                        `;
                    }).join('')}
                </tbody>
            </table>
        `;
    }

    if(closeBtn) closeBtn.onclick = () => modal.style.display = "none";
    window.onclick = (event) => { if (event.target == modal) modal.style.display = "none"; };
});