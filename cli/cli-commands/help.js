
module.exports = (args) => {

    console.log(
`
Usage: naeb --command

Commands:
    add <type> <name>
    Creates a new item of type <type>.
    Example: naeb add route myRoute

    init
    Initializes the NAEB project.
    Example: naeb init

    help
    Displays help
    Example: naeb help

`.trim());

};