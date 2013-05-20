<?php

require 'Slim/Slim.php';

$app = new Slim();

$app->get('/teams', 'getTeams');
$app->get('/teams/:id',	'getTeam');
$app->get('/teams/search/:query', 'findByName');
$app->post('/team', 'addTeam');
$app->put('/teams/:id', 'updateTeam');
$app->delete('/teams/:id',	'deleteTeam');

$app->run();

function getTeams() {
	$sql = "select * FROM team ORDER BY name";
	try {
		$db = getConnection();
		$stmt = $db->query($sql);  
		$teams = $stmt->fetchAll(PDO::FETCH_OBJ);
		$db = null;
		echo json_encode($teams);
	} catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
}

function getTeam($id) {
	$sql = "SELECT * FROM team WHERE id=:id";
	try {
		$db = getConnection();
		$stmt = $db->prepare($sql);  
		$stmt->bindParam("id", $id);
		$stmt->execute();
		$team = $stmt->fetchObject();  
		$db = null;
		echo json_encode($team); 
	} catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
}

function addTeam() {
	error_log('addWine\n', 3, '/var/tmp/php.log');
	$request = Slim::getInstance()->request();
	$team = json_decode($request->getBody());
	$sql = "INSERT INTO team (rank, votes, name) VALUES (:rank, :votes, :name)";
	try {
		$db = getConnection();
		$stmt = $db->prepare($sql);  
		$stmt->bindParam("rank", $team->rank);
		$stmt->bindParam("votes", $team->votes);
		$stmt->bindParam("name", $team->name);
		$stmt->execute();
		$team->id = $db->lastInsertId();
		$db = null;
		echo json_encode($team); 
	} catch(PDOException $e) {
		error_log($e->getMessage(), 3, '/var/tmp/php.log');
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
}

function updateTeam($id) {
	$request = Slim::getInstance()->request();
	$body = $request->getBody();
	$team = json_decode($body);
	$sql = "UPDATE team SET rank=:rank, votes=:votes, name=:name WHERE id=:id";
	try {
		$db = getConnection();
		$stmt = $db->prepare($sql);  
		$stmt->bindParam("rank", $team->rank);
		$stmt->bindParam("votes", $team->votes);
		$stmt->bindParam("name", $team->name);
		$stmt->bindParam("id", $id);
		$stmt->execute();
		$db = null;
		echo json_encode($team); 
	} catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
}

function deleteTeam($id) {
	$sql = "DELETE FROM team WHERE id=:id";
	try {
		$db = getConnection();
		$stmt = $db->prepare($sql);  
		$stmt->bindParam("id", $id);
		$stmt->execute();
		$db = null;
	} catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
}

function findByName($query) {
	$sql = "SELECT * FROM team WHERE UPPER(name) LIKE :query ORDER BY name";
	try {
		$db = getConnection();
		$stmt = $db->prepare($sql);
		$query = "%".$query."%";  
		$stmt->bindParam("query", $query);
		$stmt->execute();
		$teams = $stmt->fetchAll(PDO::FETCH_OBJ);
		$db = null;
		echo json_encode($teams);
	} catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
}

function getConnection() {
	$dbhost="127.0.0.1";
	$dbuser="root";
	$dbpass="aca007";
	$dbname="marionettedb";
	$dbh = new PDO("mysql:host=$dbhost;dbname=$dbname", $dbuser, $dbpass);	
	$dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
	return $dbh;
}

?>
