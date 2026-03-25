/**
 * Architect Build — GitHub API Bridge
 * Esta utilidad permite al dashboard interactuar con el repositorio para persistir configuraciones.
 */

const GITHUB_TOKEN = process.env.NEXT_PUBLIC_GITHUB_TOKEN || "";
const OWNER = "klarx94-Architect";
const REPO = "antigravity-whatsapp-agent";

export async function pushFileToGithub(path: string, content: string, message: string) {
  if (!GITHUB_TOKEN) {
    console.warn("GitHub Token no configurado. Operación en modo offline.");
    return { error: true, message: "Token de GitHub no configurado" };
  }

  try {
    // 1. Obtener el SHA del archivo si ya existe
    const getRes = await fetch(`https://api.github.com/repos/${OWNER}/${REPO}/contents/${path}`, {
      headers: { Authorization: `token ${GITHUB_TOKEN}` }
    });
    
    let sha = "";
    if (getRes.ok) {
      const data = await getRes.json();
      sha = data.sha;
    }

    // 2. Hacer el commit
    const putRes = await fetch(`https://api.github.com/repos/${OWNER}/${REPO}/contents/${path}`, {
      method: "PUT",
      headers: {
        Authorization: `token ${GITHUB_TOKEN}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        message: `Architect Build: ${message}`,
        content: btoa(unescape(encodeURIComponent(content))), // Encoding seguro para UTF-8
        sha: sha || undefined
      })
    });

    if (!putRes.ok) throw new Error("Error en el commit de GitHub");
    
    return await putRes.json();
  } catch (err: any) {
    return { error: true, message: err.message };
  }
}

export async function getGithubWorkflows() {
  try {
    const res = await fetch(`https://api.github.com/repos/${OWNER}/${REPO}/actions/runs`, {
      headers: { Authorization: `token ${GITHUB_TOKEN}` }
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.workflow_runs.slice(0, 10).map((run: any) => ({
      id: `run-${run.id}`,
      name: run.display_title,
      status: run.status === 'completed' ? (run.conclusion === 'success' ? 'success' : 'failure') : 'running',
      time: new Date(run.created_at).toLocaleTimeString(),
      author: run.triggering_actor.login
    }));
  } catch (err) {
    return [];
  }
}
