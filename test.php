<?php

$site_name = "My Awesome Website";
$user_logged_in = false;

function get_footer_text($year)
{
    return "Copyright &copy; " . $year . " | All rights reserved.";
}

class User
{
    public $username;

    public function __construct($username)
    {
        $this->username = $username;
    }

    public function get_welcome_message()
    {
        return "Welcome, " . htmlspecialchars($this->username) . "!";
    }
}
?>
<!DOCTYPE html>
<html>
<head>
    <title><?php echo $site_name; ?></title>
</head>
<body>
    <h1><?php echo new User("Guest")->get_welcome_message(); ?></h1>
    <?php if ($user_logged_in): ?>
        <p>You are logged in.</p>
    <?php else: ?>
        <p>Please log in to continue.</p>
    <?php endif; ?>
    <footer>
        <?php echo get_footer_text(date("Y")); ?>
    </footer>
</body>
</html>
