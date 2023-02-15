import React from "react";
import { Formik, Field, Form } from "formik";
import * as Yup from "yup";

function DependentPicklist() {
  const initialValues = {
    country: "None",
    region: "None",
    regions: [],
  };

  const regionsList = {
    "United States": [
      { value: "Washington", label: "Washington" },
      { value: "California", label: "California" },
    ],
    Canada: [
      { value: "Alberta", label: "Alberta" },
      { value: "NovaScotia", label: "NovaScotia" },
    ],
    India: [
      { value: "Mumbai", label: "Mumbai" },
      { value: "Bangalore", label: "Bangalore" },
      { value: "Chennai", label: "Chennai" },
    ],
  };

  const getRegions = (country) => {
    return new Promise((resolve, reject) => {
      console.log("country", country);
      resolve(regionsList[country]||[]);
    });
  };

  return (
    <div className="app">
      <Formik
        initialValues={initialValues}
        onSubmit={async (values) => {
          await new Promise((resolve) => setTimeout(resolve, 500));
          console.log("values", values);
        }}
      >
        {(props) => {
          const {
            values,
            dirty,
            isSubmitting,
            handleChange,
            handleSubmit,
            handleReset,
            setFieldValue,
          } = props;

          return (
            <form onSubmit={handleSubmit}>
              <label htmlFor="country">Country</label>
              <Field
                className="form-control"
                id="country"
                name="country"
                as="select"
                value={values.country}
                onChange={async (event) => {
                  const value = event.target.value;
                  const _regions = await getRegions(value);
                  console.log(_regions);
                  setFieldValue("country", value);
                  setFieldValue("region", "");
                  setFieldValue("regions", _regions);
                }}
              >
                <option value="None">--Select ountry--</option>
                <option value="United States">United States</option>
                <option value="Canada">Canada</option>
                <option value="India">India</option>
              </Field>
              <label htmlFor="region">Region</label>
              <Field
                className="form-control"
                value={values.region}
                id="region"
                name="region"
                as="select"
                onChange={handleChange}
              >
                <option value="None">--Select City--</option>
                {values.regions &&
                  values.regions.map((r) => (
                    <option key={r.value} value={r.vlue}>
                      {r.label}
                    </option>
                  ))}
              </Field>

              {/* <button
                type="button"
                className="outline"
                onClick={handleReset}
                disabled={!dirty || isSubmitting}
              >
                Reset
              </button>
              <button type="submit" disabled={isSubmitting}>
                Submit
              </button> */}
            </form>
          );
        }}
      </Formik>
    </div>
  );
}

export default DependentPicklist;

// import React from "react";
// import { Formik, Field } from "formik";
// import * as Yup from "yup";

// function dependentPicklist() {

//   const getRegions = country => {
//     // Simulate async call
//     console.log('country',country)
//     return new Promise((resolve, reject) => {
//       console.log('resolve', resolve)
//       switch (country) {
//         case "United States":
//           resolve([
//             { value: "Washington", label: "Washington" },
//             { value: "California", label: "California" }
//           ]);
//           break;
//         case "Canada":
//           resolve([
//             { value: "Alberta", label: "Alberta" },
//             { value: "NovaScotia", label: "Nova Scotia" }
//           ]);
//           break;
//         default:
//           resolve([]);
//       }
//     });
//   };

//   return (
//     <div className="app">

//       <Formik
//         initialValues={{ country: "None", region: "None", regions: [] }}
//         onSubmit={async values => {
//           await new Promise(resolve => setTimeout(resolve, 500));
//           // alert(JSON.stringify(values, null, 2));
//           console.log('values',values)
//         }}

//       >
//         {props => {
//           const {
//             values,
//             dirty,
//             isSubmitting,
//             handleChange,
//             handleSubmit,
//             handleReset,
//             setFieldValue
//           } = props;
//           return (
//             <form onSubmit={handleSubmit}>
//               <label htmlFor="country">Country</label>
//               <Field
//                 id="country"
//                 name="country"
//                 as="select"
//                 value={values.country}
//                 onChange={async e => {
//                   // const { value } = e.target;
//                   const value = e.target.value;
//                   const _regions = await getRegions(value);
//                   console.log(_regions);
//                   setFieldValue("country", value);
//                   setFieldValue("region", "");
//                   setFieldValue("regions", _regions);
//                 }}
//               >
//                 <option value="None">Select country</option>
//                 <option value="United States">United States</option>
//                 <option value="Canada">Canada</option>
//               </Field>
//               <label htmlFor="region">Region</label>
//               <Field
//                 value={values.region}
//                 id="region"
//                 name="region"
//                 as="select"
//                 onChange={handleChange}
//               >
//                 <option value="None">Select region</option>
//                 {values.regions &&
//                   values.regions.map(r => (
//                     <option key={r.value} value={r.value}>
//                       {r.label}
//                     </option>
//                   ))}
//               </Field>

//               <button
//                 type="button"
//                 className="outline"
//                 onClick={handleReset}
//                 disabled={!dirty || isSubmitting}
//               >
//                 Reset
//               </button>
//               <button type="submit" disabled={isSubmitting}>
//                 Submit
//               </button>

//             </form>
//           );
//         }}
//       </Formik>

//     </div>
//   );

// }

// export default dependentPicklist
