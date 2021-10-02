
module.exports = (args) => {

    console.log(
`
Usage: ultrax --command

Commands:
    add <type> <name>
    Creates a new item of type <type>.
    Example: ultrax add route myRoute

    init
    Initializes the UltraX project.
    Example: ultrax init

    help
    Displays help
    Example: ultrax help

`.trim());

};