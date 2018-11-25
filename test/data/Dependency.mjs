

class DependencyClass {
    

    dependencyMethod(param0, {
        optionNumber = 1,
        optionBool = true,
    }) {
        return 10;
    }
}



class NamedExportClass {

    namedMethod(param0, {
        optionNumber = 1,
        optionBool = true,
    }) {
        return 10;
    }
}


export {
    DependencyClass as default,
    NamedExportClass,
};