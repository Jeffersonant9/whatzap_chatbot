<?php
include_once('database.php');

$sql = "SELECT id, mensagem, data_envio, status FROM mensagens_agendadas ORDER BY data_envio ASC";
$result = mysqli_query($connect, $sql);
?>

<!DOCTYPE html>
<html lang="pt">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard de Mensagens Agendadas</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body class="container mt-4">
    <h2 class="text-center mb-4">📅 Mensagens Agendadas</h2>
    <table class="table table-bordered table-striped">
        <thead class="table-dark">
            <tr>
                <th>ID</th>
                <th>Mensagem</th>
                <th>Data de Envio</th>
                <th>Status</th>
            </tr>
        </thead>
        <tbody>
            <?php while ($row = mysqli_fetch_assoc($result)) : ?>
                <tr>
                    <td><?= htmlspecialchars($row['id']) ?></td>
                    <td><?= htmlspecialchars($row['mensagem']) ?></td>
                    <td><?= date("d/m/Y H:i", strtotime($row['data_envio'])) ?></td>
                    <td>
                        <span class="badge <?= $row['status'] === 'enviado' ? 'bg-success' : 'bg-warning' ?>">
                            <?= htmlspecialchars($row['status']) ?>
                        </span>
                    </td>
                </tr>
            <?php endwhile; ?>
        </tbody>
    </table>
</body>
</html>
