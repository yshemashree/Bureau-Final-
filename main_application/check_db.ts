import { PGlite } from "@electric-sql/pglite";
async function run() {
  const db = new PGlite("./.pgdata");
  const playerId = '21683be5-e2db-424a-bb13-b51f0ab9da9c';
  console.log("Player runs:", await db.query(`SELECT * FROM runs WHERE player_id = '${playerId}'`));
  console.log("Player progress:", await db.query(`SELECT * FROM run_progress WHERE player_id = '${playerId}'`));
}
run();
